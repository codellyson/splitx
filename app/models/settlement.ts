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

  // Payment status and tracking
  @column()
  declare status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

  @column()
  declare payment_reference: string | null

  @column()
  declare transaction_id: string | null

  @column.dateTime()
  declare paid_at: DateTime | null

  @column()
  declare payment_notes: string | null

  @column()
  declare payment_type: 'manual' | 'automatic' | null

  @column()
  declare payment_link: string | null

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
    foreignKey: 'from_user',
  })
  declare fromUser: relations.BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'to_user',
  })
  declare toUser: relations.BelongsTo<typeof User>
}
