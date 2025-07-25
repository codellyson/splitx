import { BaseModel, belongsTo, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Group from './group.js'
import User from './user.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class GroupInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_id: number

  @column()
  declare invited_by: number

  @column()
  declare email: string

  @column()
  declare nickname: string | null

  @column()
  declare token: string

  @column()
  declare status: 'pending' | 'accepted' | 'declined'

  @column.dateTime()
  declare expires_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Group, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare group: relations.BelongsTo<typeof Group>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'invited_by',
  })
  declare invitedByUser: relations.BelongsTo<typeof User>
}
