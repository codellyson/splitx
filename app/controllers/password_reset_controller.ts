import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import PasswordReset from '#models/password_reset'
import EmailService from '#services/email_service'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'

export default class PasswordResetController {
  /**
   * Show forgot password form
   */
  public async showForgotPassword({ inertia }: HttpContext) {
    return inertia.render('forgot-password')
  }

  /**
   * Send password reset email
   */
  public async sendResetEmail({ request, response, session }: HttpContext) {
    const validateEmail = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const { email } = await request.validateUsing(validateEmail)

    // Check if user exists
    const user = await User.findBy('email', email)
    if (!user) {
      // Don't reveal if email exists or not for security
      session.flash(
        'success',
        'If an account with that email exists, you will receive a password reset link.'
      )
      return response.redirect().back()
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.query().where('email', email).delete()

    // Generate reset token
    const token = randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    // Create password reset record
    await PasswordReset.create({
      email,
      token,
      expires_at: expiresAt,
    })

    // Send password reset email
    try {
      await EmailService.sendPasswordResetEmail(user, token)
      session.flash('success', 'Password reset link has been sent to your email.')
    } catch (error) {
      console.error('Failed to send password reset email:', error)
      session.flash('error', 'Failed to send password reset email. Please try again.')
    }

    return response.redirect().back()
  }

  /**
   * Show reset password form
   */
  public async showResetPassword({ inertia, params, response }: HttpContext) {
    const resetToken = await PasswordReset.query()
      .where('token', params.token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!resetToken) {
      return response.redirect().toRoute('forgot-password')
    }

    return inertia.render('reset-password', {
      token: params.token,
    })
  }

  /**
   * Reset password
   */
  public async resetPassword({ request, response, session }: HttpContext) {
    const validateReset = vine.compile(
      vine.object({
        token: vine.string(),
        password: vine.string().minLength(8),
        password_confirmation: vine.string(),
      })
    )

    const {
      token,
      password,
      password_confirmation: passwordConfirmation,
    } = await request.validateUsing(validateReset)

    // Validate password confirmation
    if (password !== passwordConfirmation) {
      session.flash('error', 'Passwords do not match.')
      return response.redirect().back()
    }

    // Find valid reset token
    const resetToken = await PasswordReset.query()
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!resetToken) {
      session.flash('error', 'Invalid or expired reset token.')
      return response.redirect().toRoute('/forgot-password')
    }

    // Find user
    const user = await User.findBy('email', resetToken.email)
    if (!user) {
      session.flash('error', 'User not found.')
      return response.redirect().toRoute('/forgot-password')
    }

    // Update password
    user.password = password
    await user.save()

    // Delete reset token
    await resetToken.delete()

    session.flash(
      'success',
      'Your password has been reset successfully. You can now log in with your new password.'
    )
    return response.redirect().toRoute('/auth')
  }
}
