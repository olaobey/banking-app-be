/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true, unique: true })
  accountNumber: number;

  @Prop({ required: true, default: '' })
  currency: string;

  @Prop({ required: true, default: '' })
  bank: string;

  @Prop({ required: true, default: '' })
  bvn: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, })
  userId: User;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
