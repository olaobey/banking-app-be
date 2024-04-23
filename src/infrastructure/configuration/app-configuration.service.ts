/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfigurationService {
  private readonly _connectionOptions!: { connectionString: string; secret: string; signOptions: string };

  get connectionOptions(): { connectionString: string; secret: string; signOptions: string } {
    return this._connectionOptions;
  }
  
  constructor(private readonly _configService: ConfigService) {
    this._connectionOptions = this._getConnectionStringFromEnvFile();
  }

  private _getConnectionStringFromEnvFile(): { connectionString: string; secret: string; signOptions: string } {
    const connectionString = this._configService.get<string>('MONGO_URI');
    if (!connectionString) {
      throw new Error('No connection string has been provided in the .env file.');
    }
    const secret = this._configService.get<string>('ACCESS_TOKEN_SECRET');
    const signOptions = this._configService.get<string>('JWT_EXPIRES_IN')
    return {connectionString, secret, signOptions};
  }
}