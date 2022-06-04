import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sender_id : number

  @column()
  public recipient_id : number

  @column()
  public message : string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'sender_id', // userId column on "Post" model
  })

  public sender : BelongsTo<typeof User> 

  @belongsTo(() => User, {
    foreignKey: 'recipient_id', // userId column on "Post" model
  })

  public recipient : BelongsTo<typeof User> 
  
}
