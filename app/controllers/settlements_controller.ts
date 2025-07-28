import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import ExpenseSplit from '#models/expense_split'
import Settlement from '#models/settlement'
import User from '#models/user'
import PaymentService from '#services/payment_service'
import Expense from '#models/expense'
import Group from '#models/group'
import GroupMember from '#models/group_member'
import { DateTime } from 'luxon'
import env from '#start/env'
import crypto from 'node:crypto'

export default class SettlementsController {
  /**
   * Show all settlements for the user
   */
  public async index({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()

    // Get all settlements where user is involved (either as payer or recipient)
    const settlements = await Settlement.query()
      .where('from_user', user.id)
      .orWhere('to_user', user.id)
      .preload('fromUser')
      .preload('toUser')
      .preload('group')
      .orderBy('created_at', 'desc')

    return inertia.render('settlements', {
      user,
      settlements,
    })
  }

  /**
   * Show hybrid settlement page with payment options
   */
  public async show({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const expenseSplit = await ExpenseSplit.query().where('id', params.expenseSplitId).first()

    if (!expenseSplit) {
      return response.redirect().toRoute('/groups')
    }

    const expense = await Expense.query().where('id', expenseSplit.expense_id).first()
    if (!expense) {
      return response.redirect().toRoute('/groups')
    }

    const group = await Group.query().where('id', expense.group_id).first()
    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const groupMembers = await GroupMember.query().where('group_id', group.id)
    const members = await User.query().whereIn(
      'id',
      groupMembers.map((m) => m.user_id)
    )

    // Get recipient (person who paid for the expense)
    const recipient = await User.findOrFail(expense.paid_by)

    // Create a temporary settlement object for payment options
    const tempSettlement = new Settlement()
    tempSettlement.id = expenseSplit.id
    tempSettlement.amount = expenseSplit.amount_owed
    tempSettlement.group_id = group.id
    tempSettlement.from_user = expenseSplit.user_id
    tempSettlement.to_user = expense.paid_by

    // Generate payment options
    const paymentOptions = await PaymentService.generatePaymentOptions(tempSettlement, recipient)

    return inertia.render('hybrid-settle', {
      user,
      expenseSplit,
      expense,
      group,
      group_members: groupMembers,
      members,
      recipient,
      paymentOptions,
    })
  }

  /**
   * Initialize Paystack payment
   */
  public async initializePayment({ auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()

    const validatePayment = vine.compile(
      vine.object({
        expenseSplitId: vine.number(),
        amount: vine.number(),
        note: vine.string(),
      })
    )

    const { expenseSplitId, amount, note } = await request.validateUsing(validatePayment)

    // Get expense split details
    const expenseSplit = await ExpenseSplit.findOrFail(expenseSplitId)
    const expense = await Expense.findOrFail(expenseSplit.expense_id)
    const recipient = await User.findOrFail(expense.paid_by)

    // Create settlement
    const settlement = await PaymentService.createSettlement({
      group_id: expense.group_id,
      from_user: expenseSplit.user_id,
      to_user: expense.paid_by,
      amount,
      note,
      payment_type: 'automatic',
    })

    try {
      // Initialize Paystack transaction
      const paystackResponse = await PaymentService.initializePaystackTransaction(
        settlement,
        recipient,
        user.email
      )

      // Update settlement with payment reference
      settlement.payment_reference = paystackResponse.reference
      await settlement.save()

      return response.json({
        success: true,
        authorization_url: paystackResponse.authorization_url,
        reference: paystackResponse.reference,
      })
    } catch (error) {
      // Delete settlement if Paystack initialization fails
      await settlement.delete()
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  /**
   * Create a new settlement (for manual payments)
   */
  public async create({ auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()

    const validateSettlement = vine.compile(
      vine.object({
        expenseSplitId: vine.number(),
        paymentType: vine.enum(['manual', 'automatic']),
        amount: vine.number(),
        note: vine.string(),
      })
    )

    const { expenseSplitId, paymentType, amount, note } =
      await request.validateUsing(validateSettlement)

    // Get expense split details
    const expenseSplit = await ExpenseSplit.findOrFail(expenseSplitId)
    const expense = await Expense.findOrFail(expenseSplit.expense_id)

    // Create settlement
    const settlement = await PaymentService.createSettlement({
      group_id: expense.group_id,
      from_user: expenseSplit.user_id,
      to_user: expense.paid_by,
      amount,
      note,
      payment_type: paymentType,
    })

    // Update expense split status
    expenseSplit.amount_owed = 0
    await expenseSplit.save()

    return response.redirect().toRoute('groups.show', { id: expense.group_id })
  }

  /**
   * Mark manual payment as completed
   */
  public async markAsPaid({ auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()

    const validatePayment = vine.compile(
      vine.object({
        expenseSplitId: vine.number(),
        paymentNotes: vine.string().optional(),
      })
    )

    const { expenseSplitId, paymentNotes } = await request.validateUsing(validatePayment)

    // Get expense split details
    const expenseSplit = await ExpenseSplit.findOrFail(expenseSplitId)
    const expense = await Expense.findOrFail(expenseSplit.expense_id)

    // Create settlement record
    const settlement = await PaymentService.createSettlement({
      group_id: expense.group_id,
      from_user: expenseSplit.user_id,
      to_user: expense.paid_by,
      amount: expenseSplit.amount_owed,
      note: `Manual settlement for ${expense.title}`,
      payment_type: 'manual',
    })

    console.log('Created manual settlement:', {
      id: settlement.id,
      payment_type: settlement.payment_type,
      amount: settlement.amount,
      from_user: settlement.from_user,
      to_user: settlement.to_user,
    })

    // Mark as paid
    await PaymentService.markAsPaid(settlement.id, paymentNotes)

    // Update expense split status
    expenseSplit.amount_owed = 0
    await expenseSplit.save()

    return response.redirect().toRoute('groups.show', { id: expense.group_id })
  }

  /**
   * Verify Paystack payment (webhook)
   */
  public async verifyPayment({ request, response }: HttpContext) {
    const { reference, transaction_id: transactionId } = request.only([
      'reference',
      'transaction_id',
    ])

    try {
      await PaymentService.verifyPaystackPayment(reference, transactionId)
      return response.status(200).json({ status: 'success' })
    } catch (error) {
      return response.status(400).json({ status: 'error', message: error.message })
    }
  }

  /**
   * Show individual settlement details
   */
  public async showSettlement({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()

    try {
      const settlement = await Settlement.findOrFail(params.id)
      const group = await Group.findOrFail(settlement.group_id)
      const fromUser = await User.findOrFail(settlement.from_user)
      const toUser = await User.findOrFail(settlement.to_user)

      return inertia.render('settlement-detail', {
        user,
        settlement,
        group,
        fromUser,
        toUser,
      })
    } catch (error) {
      return response.redirect().toRoute('settlements.index')
    }
  }

  /**
   * Handle Paystack payment callback (redirect after payment)
   */
  public async paymentCallback({ inertia, auth, params, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const settlement = await Settlement.findOrFail(params.id)
    const group = await Group.findOrFail(settlement.group_id)

    // Get the reference from query params (Paystack sends this)
    const reference = request.input('reference')
    const trxref = request.input('trxref')

    if (!reference && !trxref) {
      return response.redirect().toRoute('/groups/:id ', { id: settlement.group_id })
    }

    try {
      // Verify the payment with Paystack
      const verification = await PaymentService.verifyPaystackTransaction(reference || trxref)

      if (verification.success && verification.status === 'success') {
        // Update settlement status
        settlement.status = 'completed'
        settlement.transaction_id = verification.transaction_id
        settlement.paid_at = DateTime.fromISO(verification.paid_at)
        settlement.payment_notes = 'Payment verified via Paystack'
        settlement.payment_reference = verification.reference
        await settlement.save()

        // Show success page
        return inertia.render('payment-success', {
          user,
          settlement,
          group,
          status: 'success',
          message: 'Your payment has been processed successfully!',
        })
      } else {
        // Payment failed or pending
        return inertia.render('payment-success', {
          user,
          settlement,
          group,
          status: 'pending',
          message: 'Your payment is being processed. Please wait...',
        })
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      return inertia.render('payment-success', {
        user,
        settlement,
        group,
        status: 'failed',
        message: 'Payment verification failed. Please contact support.',
      })
    }
  }

  /**
   * Handle Paystack webhook
   */
  public async webhook({ request, response }: HttpContext) {
    console.log('=== WEBHOOK RECEIVED ===')
    console.log('Method:', request.method())
    console.log('URL:', request.url())
    console.log('Headers:', request.headers())

    const body = request.body()
    const signature = request.header('x-paystack-signature')
    const headers = request.headers()
    const rawBody = request.raw()
    console.log({
      body,
      signature,
      headers,
      rawBody,
    })

    try {
      if (body.event === 'charge.success') {
        const transaction = body.data
        console.log('Processing successful charge:', transaction.reference)

        await PaymentService.verifyPaystackPayment(transaction.reference, transaction.id.toString())

        return response.status(200).json({ status: 'success' })
      } else if (body.event === 'transfer.success') {
        // Handle transfer success if needed
        console.log('Transfer successful:', body.data.reference)
        return response.status(200).json({ status: 'success' })
      } else {
        console.log('Unhandled webhook event:', body.event)
        return response.status(200).json({ status: 'ignored' })
      }
    } catch (error) {
      console.error('Webhook processing error:', error)
      return response.status(400).json({ status: 'error', message: error.message })
    }
  }
}
