/* eslint-disable prettier/prettier */
import { IsNumber, IsNotEmpty } from 'class-validator';

export class DebitAccountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
