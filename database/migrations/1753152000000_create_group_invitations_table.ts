import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'group_invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('group_id').references('groups.id').notNullable()
      table.integer('invited_by').references('users.id').notNullable()
      table.string('email').notNullable()
      table.string('nickname').nullable()
      table.string('token').unique().notNullable()
      table.enum('status', ['pending', 'accepted', 'declined']).defaultTo('pending')
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
