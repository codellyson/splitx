import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ExpenseSplits from './expense_split.js'

export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_id: number

  @column()
  declare title: string

  @column()
  declare amount: number

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @hasMany(() => ExpenseSplits, {
    localKey: 'id',
    foreignKey: 'expense_id',
  })
  declare expense_splits: relations.HasMany<typeof ExpenseSplits>
}
