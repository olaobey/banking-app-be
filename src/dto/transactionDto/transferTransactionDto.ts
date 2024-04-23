/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from "mongoose";


export class TransferTransactionDto {
  [x: string]: any;
  senderAccountId: string | Types.ObjectId;
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsIn(['deposit', 'withdrawal', 'transfer'])
  type: 'withdraw'

  @IsNotEmpty()
  @IsNumber()
  @Type(() => String)
  receiverAccountId: string;
}
