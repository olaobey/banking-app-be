/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { RegisterDto } from '../dto/userDto/register.dto';
import { LoginDto } from '../dto/userDto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      // Check if the user already exists
      const existingUser = await this.userService.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      return {
        message: 'User registered successfully',
        success: true,
      };
    } catch (error) {
      throw error
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const existingUser = await this.userService.findByEmail(loginDto.email);
      if (!existingUser) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid login credentials');
      }

      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      };
      const options: JwtSignOptions = { expiresIn: '7d' };
      const secret = await this.configService.get<string>(
        'ACCESS_TOKEN_SECRET',
      );
      const token = await this.jwtService.signAsync(payload, {
        secret,
        ...options,
      });
      return {
        responseCode: 200,
        data: existingUser,
        message: 'Login successfully',
        success: true,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException('An error occurred while logging in');
    }
  }
}
