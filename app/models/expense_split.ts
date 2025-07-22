import { BaseModel, belongsTo, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Expense from './expense.js'
import User from './user.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class ExpenseSplits extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare expense_id: number

  @column()
  declare user_id: number

  @column()
  declare amount_owed: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Expense, {
    localKey: 'expense_id',
    foreignKey: 'id',
  })
  declare expense: relations.BelongsTo<typeof Expense>

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  declare user: relations.BelongsTo<typeof User>
}
