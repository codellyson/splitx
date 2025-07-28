import { BaseModel, belongsTo, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Expense from './expense.js'
import GroupMember from './group_member.js'
import Settlement from './settlement.js'
import User from './user.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'created_by',
  })
  declare createdByUser: relations.BelongsTo<typeof User>

  @hasMany(() => GroupMember, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare group_members: relations.HasMany<typeof GroupMember>

  @hasMany(() => Expense, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare expenses: relations.HasMany<typeof Expense>

  @hasMany(() => Settlement, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare settlements: relations.HasMany<typeof Settlement>
}
