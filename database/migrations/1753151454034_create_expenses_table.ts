import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('group_id').references('groups.id').notNullable()
      table.text('title').notNullable()
      table.text('description').nullable()
      table.decimal('amount', 12, 2).notNullable()
      table.integer('paid_by').references('users.id').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
