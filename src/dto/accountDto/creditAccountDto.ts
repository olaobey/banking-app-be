/* eslint-disable prettier/prettier */
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreditAccountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
