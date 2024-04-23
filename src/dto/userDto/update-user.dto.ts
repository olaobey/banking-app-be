/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../model/user.model';

export class UpdateUserDto extends PartialType(User) {}