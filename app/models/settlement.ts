import { BaseModel, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Settlement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_id: number

  @column()
  declare from_user: number

  @column()
  declare to_user: number

  @column()
  declare amount: number

  @column()
  declare method: string

  @column()
  declare note: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}

// table.increments('id')
// table.integer('group_id').unique().references('groups.id').notNullable()
// table.integer('from_user').unique().references('users.id').notNullable()
// table.integer('to_user').unique().references('users.id').notNullable()
// table.decimal('amount', 12, 2).notNullable()
// table.text('method').nullable()
// table.text('note').nullable()
// table.timestamp('created_at')
// table.timestamp('updated_at')
