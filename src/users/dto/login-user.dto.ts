import { IsEmail, IsNotEmpty, IsString } from "class-validator"

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
    readonly first_name: string
    
    @IsString()
    readonly last_name: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

}