/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
  Request,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '../auth/auth.guard'
import { CreateAccountDto } from '../dto/accountDto/createAccountDto';
import { CreditAccountDto } from '../dto/accountDto/creditAccountDto'
import { DebitAccountDto } from '../dto/accountDto/debitAccountDto'
import { GetAccountDto } from '../dto/accountDto/getAccountDto'

@Controller('/accounts')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/createAccount')
  async createAccount(@Body() accountData: CreateAccountDto, @Res() response) {
    return this.accountService.createAccount(accountData).then(
      (account) => {
        return response.status(HttpStatus.CREATED).json({
          statusCode: 200,
          data: account,
          Message: 'Account details has been created successfully',
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    );
  }

  @Get('/getAccount/:id')
  async getAccountById(@Param('id') id: string, @Res() response) {
    return this.accountService.getAccountById(id).then(
      (account) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: account,
          Message: `Account details has been retrieved with the ID ${id} successfully`,
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    );
  }

  @Get('/accountNumber')
  async getAccountByAccountNumber(
    @Body() getAccountDto: GetAccountDto, 
    @Res() response,
  ) {
    return this.accountService.getAccountByAccountNumber(getAccountDto).then(
      (account) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: account,
          Message: `Account details has been retrieved with the account number ${getAccountDto.accountNumber} successfully`,
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    );
  }

  

  @Put('/credit/:id')
  async creditAccount(
    @Param('id') accountId: string,
    @Body() creditAccountDto: CreditAccountDto,
    @Res() response,
  ) {
    return this.accountService.creditAccount(
      accountId,
      creditAccountDto,
    ).then(
      (account) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: account,
          Message: `Account has been credited with amount ${creditAccountDto.amount} successfully`,
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    )
  }

  @Put('/debit/:id')
  async debitAccount(
    @Param('id') accountId: string,
    @Body() debitAccountDto: DebitAccountDto,
    @Res() response,
  ) {
    return this.accountService.debitAccount(
      accountId,
      debitAccountDto,
    ).then(
      (account) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: account,
          Message: `Account has been debited with amount ${debitAccountDto.amount} successfully`,
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    );
  }

  @Get('/transactions/:id')
  async getAccountTransactionLogs(
    @Query('page') page: number = 1,
    @Res() response,
    @Request() req
  ) {
    const userId = req.user._id;
    const { transactions, total } =
     await this.accountService.getAccountTransactionLogs(userId, page).then(
      (account) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          transactions,
          total,
          data: account,
          Message: `Transaction account logs with ${userId} has been retrieved successfully`,
          success: true,
        });
      },
      (err) => {
        console.log('err', err);
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: err.message });
      },
    );
  }
}
