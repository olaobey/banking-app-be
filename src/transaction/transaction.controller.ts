/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// transaction.controller.ts
import { Body, Controller, UseGuards, Post, Get,
  Patch,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
  Request,
  Query,
  Res} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/auth.guard'
import { DepositTransactionDto } from '../dto/transactionDto/depositTransactionDto';
import { WithdrawTransactionDto } from '../dto/transactionDto/withdrawTransaction.Dto';
import { TransferTransactionDto } from '../dto/transactionDto/transferTransactionDto';
import { Types } from "mongoose";



@Controller('/transactions')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  async depositAmount(@Body() depositTransactionDto: DepositTransactionDto, @Request() req, @Res() response) {
    // Assign senderAccountId from req.user.id
    depositTransactionDto.senderAccountId = req.user._id;
    await this.transactionService.depositAmount({
      ...depositTransactionDto,
      senderAccountId: new Types.ObjectId(depositTransactionDto.senderAccountId)
    }).then(
      (transaction) => {
          return response.status(HttpStatus.CREATED).json({
            statusCode:200,
           data: transaction,
           Message: `Amount has been deducted form your account and deposited to the receiver with the ID ${transaction.receiver._id}  successfully`,
           success: true
          });
      }
      ,
      (err) => {
          console.log("err", err)
          return response.status(HttpStatus.FORBIDDEN).json({ message: err.message });
      });
  }

  @Post('/withdraw')
  async withdrawAmount(@Body() withdrawTransactionDto: WithdrawTransactionDto, @Request() req, @Res() response) {
    withdrawTransactionDto.senderAccountId = req.user._id;
    return this.transactionService.withdrawAmount({
      ...withdrawTransactionDto,
      senderAccountId: new Types.ObjectId(withdrawTransactionDto.senderAccountId)
    }).then(
      (transaction) => {
          return response.status(HttpStatus.CREATED).json({
            statusCode:200,
           data: transaction,
           Message: 'Amount has been withdrawn successfully',
           success: true
          });
      }
      ,
      (err) => {
          console.log("err", err)
          return response.status(HttpStatus.FORBIDDEN).json({ message: err.message });
      });
  }

  @Post('/transfer')
  async transferAmount(@Body() transferTransactionDto: TransferTransactionDto, @Request() req, @Res() response) {
    transferTransactionDto.senderAccountId = req.user._id;
    return this.transactionService.transferAmount({
      ...transferTransactionDto,
      senderAccountId: new Types.ObjectId(transferTransactionDto.senderAccountId)
    }).then(
      (transaction) => {
          return response.status(HttpStatus.CREATED).json({
            statusCode:200,
           data: transaction,
           Message: `Amount transferred to the receiver with ID ${transferTransactionDto.receiver._id} is successful`,
           success: true
          });
      }
      ,
      (err) => {
          console.log("err", err)
          return response.status(HttpStatus.FORBIDDEN).json({ message: err.message });
      });
  }

  @Delete('/logs/:id')
  async deleteTransaction(@Param('id') id: string, @Request() req,) {
    const userId = req.user._id; 
    return this.transactionService.deleteTransaction(id, userId)
  }
}
