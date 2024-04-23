/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from "mongoose";

export class WithdrawTransactionDto {
  senderAccountId: string | Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsIn(['deposit', 'withdrawal', 'transfer'])
  type: 'withdraw'

}
