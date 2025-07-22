import { BaseModel, belongsTo, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Group from './group.js'
import User from './user.js'

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

  @belongsTo(() => Group, {
    localKey: 'group_id',
    foreignKey: 'id',
  })
  declare group: relations.BelongsTo<typeof Group>

  @belongsTo(() => User, {
    localKey: 'from_user',
    foreignKey: 'id',
  })
  declare fromUser: relations.BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'to_user',
    foreignKey: 'id',
  })
  declare toUser: relations.BelongsTo<typeof User>
}
