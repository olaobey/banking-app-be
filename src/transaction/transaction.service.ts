/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// transaction.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../model/transaction.model';
import { Account, AccountDocument } from '../model/account.model';
import { User } from '../model/user.model';
import { DepositTransactionDto } from '../dto/transactionDto/depositTransactionDto';
import { WithdrawTransactionDto } from '../dto/transactionDto/withdrawTransaction.Dto';
import { TransferTransactionDto } from '../dto/transactionDto/transferTransactionDto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async depositAmount(depositDto: DepositTransactionDto): Promise<Transaction> {
    try {
      // Retrieve sender and receiver user details
      const sender = await this.accountModel
        .findById(depositDto.senderAccountId)
        .exec();

      const receiver = await this.accountModel
        .findById(depositDto.receiverAccountId)
        .exec();
      if (!sender || !receiver) {
        throw new NotFoundException('Sender or receiver not found');
      }

      // Check if sender's balance is sufficient
      if (sender.balance < depositDto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Check if sender is trying to send money to themselves
      if (sender._id.toString() === receiver._id.toString()) {
        throw new BadRequestException('You cannot send money to Yourself');
      }

      // Update sender's balance and receiver's balance
      sender.balance -= depositDto.amount;
      receiver.balance += depositDto.amount;

      // Save changes to the sender and receiver
      await this.accountModel.findByIdAndUpdate(sender._id, sender).exec();
      await this.accountModel.findByIdAndUpdate(receiver._id, receiver).exec();

      // Check if the transferred amount is less than 100
      if (depositDto.amount < 100) {
        throw new BadRequestException(
          'Deposit amount must be at least 100 naira',
        );
      }

      // Determine transactionType based on whether the user is sender or receiver
      let transactionType: 'deposit' | 'withdraw' | 'transfer';

      if (sender._id.toString() === depositDto.senderAccountId.toString()) {
        transactionType = 'deposit';
      } else {
        // Handle any other cases or throw an error if needed
        throw new BadRequestException('Invalid transaction');
      }

      // Create the transaction record
      const transaction = new this.transactionModel({
        ...depositDto,
        transactionType,
        status: 'Success',
      });
      await transaction.save();

      return transaction;
    } catch (error) {
      throw error;
    }
  }
  async withdrawAmount(
    withdrawDto: WithdrawTransactionDto,
  ): Promise<{
    data: Transaction;
    message: string;
    statusCode: number;
    success: boolean;
  }> {
    try {
      const account = await this.accountModel.findById(
        withdrawDto.senderAccountId,
      );

      if (!account) {
        throw new Error('Account not found');
      }

      if (account.balance < withdrawDto.amount) {
        throw new Error('Insufficient funds for withdrawal');
      }

      // Update user account balance
      account.balance -= withdrawDto.amount;

      // Save changes to the sender and receiver
      await this.accountModel.findByIdAndUpdate(account._id, account).exec();

      // Check if the withdraw amount is less than 100
      if (withdrawDto.amount < 100) {
        throw new BadRequestException(
          'Transferred amount must be at least 100 naira',
        );
      }

      // Determine transactionType based on whether the user is sender or receiver
      let transactionType: 'deposit' | 'withdraw' | 'transfer';

      if (account._id.toString() === withdrawDto.senderAccountId.toString()) {
        transactionType = 'withdraw';
      } else {
        // Handle any other cases or throw an error if needed
        throw new BadRequestException('Invalid transaction');
      }

      const transaction = new this.transactionModel({
        ...withdrawDto,
        transactionType,
        status: 'Success',
      });

      await transaction.save();
      return {
        statusCode: 200,
        data: transaction,
        message: 'Amount has been successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
  async transferAmount(
    transferDto: TransferTransactionDto,
  ): Promise<Transaction> {
    const session = await this.transactionModel.db.startSession();
    session.startTransaction();
    try {
      const sender = await this.accountModel
        .findById(transferDto.senderAccountId)
        .exec();
      const receiver = await this.accountModel
        .findById(transferDto.receiverAccountId)
        .exec();

      if (!sender || !receiver) {
        throw new NotFoundException('Sender or receiver not found');
      }

      // Check if sender's balance is sufficient
      if (sender.balance < transferDto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Check if sender is trying to send money to themselves
      if (sender._id.toString() === receiver._id.toString()) {
        throw new BadRequestException('You cannot send money to Yourself');
      }

      // Update sender's balance and receiver's balance
      sender.balance -= transferDto.amount;
      receiver.balance += transferDto.amount;

      // Save changes to the sender and receiver
      await this.accountModel.findByIdAndUpdate(sender._id, sender).exec();
      await this.accountModel.findByIdAndUpdate(receiver._id, receiver).exec();

      // Check if the transferred amount is less than 100
      if (transferDto.amount < 100) {
        throw new BadRequestException(
          'Transferred amount must be at least 100 naira',
        );
      }

      // Determine transactionType based on whether the user is sender or receiver
      let transactionType: 'deposit' | 'withdraw' | 'transfer';

      if (sender._id.toString() === transferDto.senderAccountId.toString()) {
        transactionType = 'transfer';
      } else {
        // Handle any other cases or throw an error if needed
        throw new BadRequestException('Invalid transaction');
      }

      const transaction = new this.transactionModel({
        ...transferDto,
        transactionType,
        status: 'Success',
      });
      await transaction.save();

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async deleteTransaction(id: string, userId: string): Promise<Transaction> {
    try {
      // Verify the user's account before deletion
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`Account with the ID ${userId} not found`);
      }

      // Find the transaction
      const transaction = await this.transactionModel.findById(id);

      if (!transaction) {
        throw new NotFoundException('Transaction log not found');
      }

      // Check if the user is authorized to delete the transaction
      if (transaction.senderAccountId.toString() !== userId.toString()) {
        throw new UnauthorizedException(
          'You are not authorized to delete this transaction',
        );
      }

      // Delete the transaction log
      await this.transactionModel.findByIdAndDelete(id);
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
