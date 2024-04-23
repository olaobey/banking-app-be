/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from "mongoose";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsNumber()
  accountNumber: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  bvn: string;

  @IsMongoId()
  userId: string | Types.ObjectId;
}
