import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Bank account details for manual transfers
      table.string('bank_name').nullable()
      table.string('account_number').nullable()
      table.string('account_name').nullable()

      // Paystack account for automatic payments
      table.string('paystack_account_code').nullable()
      table.boolean('paystack_enabled').defaultTo(false)

      // Payment preferences
      table.enum('preferred_payment_method', ['manual', 'automatic', 'both']).defaultTo('both')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('bank_name')
      table.dropColumn('account_number')
      table.dropColumn('account_name')
      table.dropColumn('paystack_account_code')
      table.dropColumn('paystack_enabled')
      table.dropColumn('preferred_payment_method')
    })
  }
}
