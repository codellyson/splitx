import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settlements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('group_id').unique().references('groups.id').notNullable()
      table.integer('from_user').unique().references('users.id').notNullable()
      table.integer('to_user').unique().references('users.id').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.text('method').nullable()
      table.text('note').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
