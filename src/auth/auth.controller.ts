/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body,  Request,
  HttpStatus,
  Put,
  Res, } from '@nestjs/common';
import { RegisterDto } from '../dto/userDto/register.dto';
import { LoginDto } from '../dto/userDto/login.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto,  @Res() response): Promise<string> {
    return this.authService.register(registerDto)
    .then((register) => {
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: register
      });
    })
    .catch((error) => {
      return response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: error.message,
        success: false,
      });
    }); 
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() response): Promise<string> {
    return this.authService.login(loginDto).then(
      (login) => {
        return response.status(HttpStatus.OK).json({
          statusCode: 200,
          data:login,
          Message: 'Login successfully',
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
