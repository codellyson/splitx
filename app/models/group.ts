import { BaseModel, belongsTo, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import GroupMember from './group_member.js'
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
    localKey: 'created_by',
    foreignKey: 'id',
  })
  declare createdByUser: relations.BelongsTo<typeof User>

  @hasMany(() => GroupMember, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare group_members: relations.HasMany<typeof GroupMember>
}
