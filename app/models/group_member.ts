import { BaseModel, belongsTo, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Group from './group.js'
import User from './user.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class GroupMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare group_id: number

  @column()
  declare nickname: string

  @column.dateTime()
  declare joined_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  declare user: relations.BelongsTo<typeof User>

  @belongsTo(() => Group, {
    localKey: 'id',
    foreignKey: 'group_id',
  })
  declare group: relations.BelongsTo<typeof Group>
}
