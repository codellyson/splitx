import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settlements'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Payment status tracking
      table
        .enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled'])
        .defaultTo('pending')
      table.string('payment_reference').nullable()
      table.string('transaction_id').nullable()
      table.timestamp('paid_at').nullable()
      table.text('payment_notes').nullable()

      // Payment method details
      table.enum('payment_type', ['manual', 'automatic']).nullable()
      table.string('payment_link').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('payment_reference')
      table.dropColumn('transaction_id')
      table.dropColumn('paid_at')
      table.dropColumn('payment_notes')
      table.dropColumn('payment_type')
      table.dropColumn('payment_link')
    })
  }
}
