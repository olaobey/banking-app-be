/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty({
        message: "Please enter your full name!"
    })
    firstName: string;

    @IsString()
    @IsNotEmpty({
        message: "Please enter your surname!"
    })
    lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty({
        message: "Please enter your email!"
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 25, {
        message: "Password must be between 6 and 25 characters long."
    })
    password: string;
}
