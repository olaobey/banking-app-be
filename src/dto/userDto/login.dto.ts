/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty({
        message: "Please enter your email!"
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 25, {
        message: "Password must be between 6 and 25 characters long."
    })
    password: string
}