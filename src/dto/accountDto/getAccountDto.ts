/* eslint-disable prettier/prettier */
import { IsNumber, IsNotEmpty } from 'class-validator';

export class GetAccountDto {
  @IsNotEmpty()
  @IsNumber()
  accountNumber: string;
}
