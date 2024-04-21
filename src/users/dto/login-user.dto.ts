import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose"

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    readonly password: string
}

export class OAuthLoginDto {
    @IsString()
    readonly _first_name: string

    @IsString()
    readonly _last_name: string

    @IsEmail()
    @IsNotEmpty()
    readonly _email: string

    readonly _id?: mongoose.Schema.Types.ObjectId
    readonly _notes?: mongoose.Schema.Types.ObjectId
    readonly _tasks?: mongoose.Schema.Types.ObjectId
}

export class OAuthRegisterDto {
    @IsString()
    @IsNotEmpty()
    readonly first_name: string

    @IsString()
    @IsNotEmpty()
    readonly last_name: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string
}