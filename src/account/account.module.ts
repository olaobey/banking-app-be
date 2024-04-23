/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {AccountService } from './account.service'
import {AccountController} from './account.controller'
import { Account, AccountSchema } from '../model/account.model';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { Transaction, TransactionSchema } from '../model/transaction.model'


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        UsersModule,
    ],
    controllers: [AccountController],
    providers: [AccountService, UserService]
})


export class AccountModule {}
