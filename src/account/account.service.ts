/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../model/account.model';
import { CreateAccountDto } from '../dto/accountDto/createAccountDto'
import { CreditAccountDto } from '../dto/accountDto/creditAccountDto'
import { DebitAccountDto } from '../dto/accountDto/debitAccountDto'
import { GetAccountDto } from '../dto/accountDto/getAccountDto'
import { Transaction, TransactionDocument } from '../model/transaction.model'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createAccount(
    accountData: CreateAccountDto,
  ): Promise<Account> {
    const { accountName, accountNumber, currency, bank, bvn, } = accountData
    try {
      const createdAccount = new this.accountModel({
        accountName,
        accountNumber,
        currency, 
        bank,
        bvn,
      });
      await createdAccount.save();
      return createdAccount
    } catch (error) {
      throw error;
    }
  }

  async getAccountById(
    id: string,
  ): Promise<Account> {
    try {
      const existingAccount = await this.accountModel
        .findById(id)
        .exec();
      if (!existingAccount) {
        throw new NotFoundException('Account not found');
      }
      return existingAccount
    } catch (error) {
      throw error;
    }
  }

  async getAccountByAccountNumber(
   getAccountDto: GetAccountDto, 
  ): Promise<Account> {
    try {
      const existingAccount = await this.accountModel
        .findOne({ accountNumber: getAccountDto.accountNumber })
        .exec();
      if (!existingAccount) {
        throw new NotFoundException('Account not found');
      }
      return existingAccount;
    } catch (error) {
      throw error;
    }
  }

  async creditAccount(
    accountId: string,
    creditAccountDto: CreditAccountDto
  ): Promise<Account> {
    try {
        const updatedAccount = await this.accountModel.findByIdAndUpdate(
          accountId,
          { $inc: { balance: creditAccountDto.amount } },
          { new: true },
        ).exec();
        return updatedAccount

      } catch (error) {
        throw error;
      }
  }

  async debitAccount(accountId: string, debitAccountDto: DebitAccountDto): Promise<Account> {
    try {
      const updatedAccount = await this.accountModel.findByIdAndUpdate(
        accountId,
        { $inc: { balance: -debitAccountDto.amount } }, 
        { new: true }, 
      ).exec();
      return updatedAccount;
    } catch (error) {
      throw error;
    }
  }

  
  async getAccountTransactionLogs(
    userId: string,
    page: number = 1,
  ): Promise<{ transactions: Transaction[]; total: number, message: string, statusCode: number, success: boolean}> {
    try {
    const perPage = 10;
    const skips = perPage * (page - 1);
  
    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(
          {
            $or: [{ senderAccountId: userId }, { receiverAccountId: userId }],
          }
        )
        .sort({ timestamp: -1 })
        .skip(skips)
        .limit(perPage)
        .exec(),
      this.transactionModel.countDocuments({
        $or: [{ senderAccountId: userId }, { receiverAccountId: userId }],
      }),
    ]);
  
    if (!transactions) {
      throw new NotFoundException('Transaction logs not found');
    }
  
    return {
      statusCode: 200,
       transactions,
        total,
        message: 'Transaction list has been successfully retrieved',
        success: true
       };
  } catch(error) {
    throw error;
  }
}
}
