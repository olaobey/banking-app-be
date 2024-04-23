/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query,Post, Body, Put, Delete, Request,
  HttpStatus,
  Res, } from '@nestjs/common';
import { UserService } from './users.service';
import { RegisterDto } from '../dto/userDto/register.dto';
import { UpdateUserDto } from '../dto/userDto/update-user.dto';
import { User } from '../model/user.model';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getUser/:id')
  async getUserById(@Param('id') id: string, @Res() response): Promise<User | null> {
    return this.userService.findById(id).then(
      (user) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data:user,
          Message: 'User have been retrieve successfully',
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

  @Post('/createUser')
  async createUser(@Body() registerDto: RegisterDto, @Res() response): Promise<User> {
    return this.userService.createUser(registerDto)
  }

  @Get('/getUserByEmail')
  async getUserByEmail(@Body() email: string, @Res() response): Promise<User | null> {
    return this.userService.findById(email).then(
      (user) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data:user,
          Message: 'User have been retrieve successfully',
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

  @Get('/getUsers')
  async getUsers(
    @Query('page') page: number = 1, // Default to page 1 if not specified
    @Query('pageSize') pageSize: number = 10, // Default to 10 items per page if not specified
    @Res() response,
    @Request() req
  ) {
    const { users, total } = await this.userService.getUsers(page, pageSize)
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          users,
          total,
          pageSize,
          data: users,
          Message: `Users have been retrieved successfully`,
          success: true,
        });
  }

  @Put('/update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response,
  @Request() req): Promise<User | null> {
    return this.userService.updateUser(id, updateUserDto).then(
      (user) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: user,
          Message: `User data has been updated successfully`,
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

  @Delete('/deleteUser/:id')
  async deleteUser(@Param('id') id: string, @Res() response): Promise<User> {
    return this.userService.deleteUser(id).then(
      (user) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data: user,
          Message: `User has been deleted successfully`,
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
