/* eslint-disable prettier/prettier */
// transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Account } from './account.model';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  [x: string]: any;
  @Prop({ default: 'deposit', enum: ['deposit', 'withdrawal', 'transfer'] })
  transactionType: string;


  @Prop({ required: true })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true,  })
  senderAccountId: Account;

  @Prop({ required: true })
  receiverAccountId: string;
  
  @Prop({ default: 'Pending', enum: ['Pending', 'Success', 'Error'] })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
