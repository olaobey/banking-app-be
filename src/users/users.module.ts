/* eslint-disable prettier/prettier */
import { Module} from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "../model/user.model"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name , schema: UserSchema }])
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [ UserService, MongooseModule],
})


export class UsersModule {}
