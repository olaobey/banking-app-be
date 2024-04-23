/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module';
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service';
import { UserController } from './users/users.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { TransactionService } from './transaction/transaction.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { AccountService } from './account/account.service';
import { JwtModule, JwtService } from '@nestjs/jwt'; 
import { ConfigModule } from '@nestjs/config'; 
import { UserService } from './users/users.service';
import { UserSchema } from './model/user.model';
import { TransactionSchema } from './model/transaction.model'; 
import { AccountSchema } from './model/account.model';
import { AccountController } from './account/account.controller';
import { CastErrorFilter } from './cast-error.filter';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', 
    }),
    AppConfigurationModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET, 
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
      },
    }),
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: appConfigService.connectionOptions.connectionString,
        };
        return options;
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Account', schema: AccountSchema },
    ]),
    RouterModule.register([{
      path: 'user',
      module: UsersModule,
    },{ path: 'auth', module:  AuthModule},
    { path: 'transaction', module: TransactionModule},
    {path: 'account', module: AccountModule}
  ]),
  ],
  controllers: [AppController, UserController, AuthController, TransactionController, AccountController],
  providers: [AppService, AuthService, UserService, TransactionService, AccountService, {
    provide: APP_FILTER,
    useClass: CastErrorFilter,
  }],
})
export class AppModule {}
