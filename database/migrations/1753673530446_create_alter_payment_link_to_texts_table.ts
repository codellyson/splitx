import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settlements'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Change payment_link from VARCHAR(255) to TEXT to accommodate longer Paystack URLs
      table.text('payment_link').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Revert back to VARCHAR(255) if needed
      table.string('payment_link', 255).alter()
    })
  }
}
