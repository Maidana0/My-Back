import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly first_name: string

    @IsNotEmpty()
    @IsString()
    readonly last_name: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    readonly password: string

    // readonly notes: Tasks

    // readonly tasks: mongoose.Schema.Types.ObjectId

    // constructor(user) {
    //     this.first_name = user.first_name ? user.first_name : user.username.split(' ')[0],
    //         this.last_name = user.last_name ? user.last_name : user.username.split(' ')[1],
    //         this.email = user.email,
    //         this.password = user.password ? user.password : ' '
    // }
}


