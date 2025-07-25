import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import GroupInvitation from '#models/group_invitation'
import User from '#models/user'
import Group from '#models/group'
import { inject } from '@adonisjs/core'
import { formatCurrency } from '../../utils/index.js'

@inject()
export default class EmailService {
  /**
   * Send group invitation email
   */

  static async sendGroupInvitation(invitation: GroupInvitation) {
    try {
      const inviteUrl = `${env.get('APP_URL')}/invite/${invitation.token}`
      console.log(inviteUrl)
      await mail
        .send((message: any) => {
          message
            .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
            .to(invitation.email)
            .subject(`You're invited to join ${invitation.group?.name} on SplitX`)
            .htmlView('emails/group_invitation', {
              invitation,
              inviteUrl,
              group: invitation.group,
              invitedBy: invitation.invitedByUser,
            })
        })
        .then(() => {
          console.log('Invitation email sent successfully')
        })
        .catch((error) => {
          console.error('Failed to send invitation email:', error)
        })
    } catch (error) {
      console.error('Failed to send invitation email:', error)
    }
  }

  /**
   * Send payment request email
   */
  static async sendPaymentRequest(
    recipientEmail: string,
    recipientName: string,
    amount: number,
    groupName: string,
    paymentLink: string,
    message?: string
  ) {
    await mail.send((messageBuilder: any) => {
      messageBuilder
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(recipientEmail)
        .subject(`Payment Request - ${groupName}`)
        .htmlView('emails/payment_request', {
          recipientName,
          amount: formatCurrency(amount),
          groupName,
          paymentLink,
          message,
        })
    })
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(user: User) {
    await mail.send((message: any) => {
      message
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(user.email)
        .subject('Welcome to SplitX!')
        .htmlView('emails/welcome', {
          user,
        })
    })
  }

  /**
   * Send expense notification email
   */
  static async sendExpenseNotification(user: User, expense: any, group: Group, amountOwed: number) {
    await mail.send((message: any) => {
      message
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(user.email)
        .subject(`New expense in ${group.name}`)
        .htmlView('emails/expense_notification', {
          user,
          expense,
          group,
          amountOwed,
        })
    })
  }

  /**
   * Send settlement confirmation email
   */
  static async sendSettlementConfirmation(
    fromUser: User,
    toUser: User,
    amount: number,
    group: Group
  ) {
    await mail.send((message: any) => {
      message
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(toUser.email)
        .subject(`Payment received from ${fromUser.full_name}`)
        .htmlView('emails/settlement_confirmation', {
          fromUser,
          toUser,
          amount,
          group,
        })
    })
  }
  static async sendTemporaryPassword(user: User, password: string) {
    await mail.send((message: any) => {
      message
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(user.email)
        .subject('Your temporary password for SplitX')
        .htmlView('emails/temporary_password', {
          user,
          password,
          APP_URL: env.get('APP_URL'),
        })
    })
  }
  static async sendPasswordResetEmail(user: User, token: string) {
    await mail.send((message: any) => {
      message
        .from(env.get('MAIL_FROM', 'noreply@splitx.com'))
        .to(user.email)
        .subject('Password Reset Request')
        .htmlView('emails/password_reset', {
          user,
          token,
          APP_URL: env.get('APP_URL'),
        })
    })
  }
}
