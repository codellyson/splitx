import User from '#models/user'
import Settlement from '#models/settlement'
import env from '#start/env'
import { DateTime } from 'luxon'
import axios from 'axios'
import crypto from 'node:crypto'

export default class PaymentService {
  private static readonly PAYSTACK_BASE_URL = 'https://api.paystack.co'
  private static readonly PAYSTACK_SECRET_KEY = env.get('PAYSTACK_SECRET_KEY')

  /**
   * Verify Paystack webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hash = crypto
        .createHmac('sha512', this.PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest('hex')

      return hash === signature
    } catch (error) {
      console.error('Webhook signature verification error:', error)
      return false
    }
  }

  /**
   * Generate payment options for a settlement
   */
  static async generatePaymentOptions(settlement: Settlement, recipient: User) {
    const options = {
      manual: null as any,
      automatic: null as any,
      preferred: recipient.preferred_payment_method,
    }

    // Manual transfer option (always available)
    if (recipient.bank_name && recipient.account_number) {
      options.manual = {
        type: 'manual',
        title: 'Bank Transfer',
        description: 'Transfer directly to bank account',
        bankName: recipient.bank_name,
        accountNumber: recipient.account_number,
        accountName: recipient.account_name,
        amount: settlement.amount,
        reference: `SPLITX-${settlement.id}`,
        instructions: [
          'Transfer the exact amount to the account above',
          `Use reference: SPLITX-${settlement.id}`,
          'Keep your transfer receipt for confirmation',
        ],
      }
    }

    // Automatic payment option (if recipient has Paystack enabled)
    if (recipient.paystack_enabled && recipient.paystack_account_code) {
      options.automatic = {
        type: 'automatic',
        title: 'Pay with Card',
        description: 'Pay instantly with card or bank transfer',
        amount: settlement.amount,
        features: [
          'Instant payment processing',
          'Multiple payment methods',
          'Automatic confirmation',
          'Secure transaction',
        ],
      }
    }

    return options
  }

  /**
   * Initialize Paystack transaction
   */
  static async initializePaystackTransaction(
    settlement: Settlement,
    recipient: User,
    payerEmail: string
  ) {
    try {
      const response = await axios.post(
        `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          amount: Math.round(settlement.amount * 100), // Convert to kobo
          email: payerEmail,
          reference: `SPLITX-${settlement.id}`,
          callback_url: `${env.get('APP_URL')}/settlements/${settlement.id}/verify`,
          metadata: {
            settlement_id: settlement.id,
            group_id: settlement.group_id,
            from_user: settlement.from_user,
            to_user: settlement.to_user,
            custom_fields: [
              {
                display_name: 'Settlement ID',
                variable_name: 'settlement_id',
                value: settlement.id.toString(),
              },
            ],
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.status && response.data.data) {
        return {
          success: true,
          authorization_url: response.data.data.authorization_url,
          access_code: response.data.data.access_code,
          reference: response.data.data.reference,
        }
      } else {
        throw new Error('Failed to initialize Paystack transaction')
      }
    } catch (error) {
      console.error('Paystack initialization error:', error)
      throw new Error('Failed to initialize payment. Please try again.')
    }
  }

  /**
   * Verify Paystack transaction
   */
  static async verifyPaystackTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          },
        }
      )

      if (response.data.status && response.data.data) {
        const transaction = response.data.data
        return {
          success: true,
          status: transaction.status,
          amount: transaction.amount / 100, // Convert from kobo
          reference: transaction.reference,
          transaction_id: transaction.id,
          paid_at: transaction.paid_at,
        }
      } else {
        throw new Error('Failed to verify Paystack transaction')
      }
    } catch (error) {
      console.error('Paystack verification error:', error)
      throw new Error('Failed to verify payment. Please try again.')
    }
  }

  /**
   * Create a new settlement with payment options
   */
  static async createSettlement(data: {
    group_id: number
    from_user: number
    to_user: number
    amount: number
    note: string
    payment_type?: 'manual' | 'automatic'
  }) {
    const recipient = await User.findOrFail(data.to_user)

    console.log('Creating settlement with data:', {
      group_id: data.group_id,
      from_user: data.from_user,
      to_user: data.to_user,
      amount: data.amount,
      payment_type: data.payment_type,
      note: data.note,
    })

    const settlement = await Settlement.create({
      group_id: data.group_id,
      from_user: data.from_user,
      to_user: data.to_user,
      amount: data.amount,
      method: data.payment_type || 'manual',
      note: data.note,
      status: 'pending',
      payment_type: data.payment_type || 'manual',
    })

    console.log('Created settlement:', {
      id: settlement.id,
      payment_type: settlement.payment_type,
      method: settlement.method,
    })

    return settlement
  }

  /**
   * Mark settlement as paid (for manual transfers)
   */
  static async markAsPaid(settlementId: number, paymentNotes?: string) {
    const settlement = await Settlement.findOrFail(settlementId)

    settlement.status = 'completed'
    settlement.paid_at = DateTime.now()
    settlement.payment_notes = paymentNotes || 'Manual transfer confirmed'

    await settlement.save()

    return settlement
  }

  /**
   * Verify Paystack payment (webhook handler)
   */
  static async verifyPaystackPayment(reference: string, transactionId: string) {
    const settlement = await Settlement.query().where('payment_reference', reference).first()

    if (!settlement) {
      throw new Error('Settlement not found')
    }

    // Verify with Paystack API
    const verification = await this.verifyPaystackTransaction(reference)

    if (verification.success && verification.status === 'success') {
      settlement.status = 'completed'
      settlement.transaction_id = verification.transaction_id
      settlement.paid_at = DateTime.fromISO(verification.paid_at)
      settlement.payment_notes = 'Payment verified via Paystack'
      settlement.payment_reference = verification.reference

      await settlement.save()
      return settlement
    } else {
      throw new Error('Payment verification failed')
    }
  }

  /**
   * Get settlement status with payment options
   */
  static async getSettlementWithOptions(settlementId: number) {
    const settlement = await Settlement.query()
      .where('id', settlementId)
      .preload('fromUser')
      .preload('toUser')
      .preload('group')
      .firstOrFail()

    const recipient = await User.findOrFail(settlement.to_user)
    const paymentOptions = await this.generatePaymentOptions(settlement, recipient)

    return {
      settlement,
      paymentOptions,
    }
  }
}
