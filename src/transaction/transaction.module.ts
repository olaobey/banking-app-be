/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { Transaction, TransactionSchema } from "../model/transaction.model"
import {User, UserSchema} from '../model/user.model'
import { Account, AccountSchema} from '../model/account.model'


@Module({imports: [
    MongooseModule.forFeature([
        { name: Transaction.name, schema: TransactionSchema },
        { name: User.name, schema:  UserSchema },
        { name:  Account.name, schema:   AccountSchema },
]),
],
providers: [TransactionService],
controllers: [TransactionController],
exports: [TransactionService],})


export class TransactionModule {}
