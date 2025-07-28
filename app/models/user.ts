import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Expense from './expense.js'
import ExpenseSplits from './expense_split.js'
import Group from './group.js'
import Settlement from './settlement.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare full_name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  // Payment-related fields
  @column()
  declare bank_name: string | null

  @column()
  declare account_number: string | null

  @column()
  declare account_name: string | null

  @column()
  declare paystack_account_code: string | null

  @column()
  declare paystack_enabled: boolean

  @column()
  declare preferred_payment_method: 'manual' | 'automatic' | 'both'

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @hasMany(() => Group, {
    localKey: 'id',
    foreignKey: 'created_by',
  })
  declare createdGroups: relations.HasMany<typeof Group>

  @hasMany(() => Expense, {
    localKey: 'id',
    foreignKey: 'paid_by',
  })
  declare paidExpenses: relations.HasMany<typeof Expense>

  @hasMany(() => ExpenseSplits, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  declare expenseSplits: relations.HasMany<typeof ExpenseSplits>

  @hasMany(() => Settlement, {
    localKey: 'id',
    foreignKey: 'from_user',
  })
  declare settlementsFrom: relations.HasMany<typeof Settlement>

  @hasMany(() => Settlement, {
    localKey: 'id',
    foreignKey: 'to_user',
  })
  declare settlementsTo: relations.HasMany<typeof Settlement>
}
