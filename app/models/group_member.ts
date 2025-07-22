import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Group from './group.js'
import User from './user.js'

export default class GroupMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare group_id: number

  @column()
  declare nickname: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  declare user: relations.BelongsTo<typeof User>
  @hasOne(() => Group, {
    localKey: 'group_id',
    foreignKey: 'id',
  })
  declare group: relations.HasOne<typeof Group>
}
