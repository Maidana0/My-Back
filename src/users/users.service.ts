import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Model } from 'mongoose';
import User from './schemas/user.schema';
import Tasks from '../tasks/schemas/tasks.schema';

import Notes from '../notes/schemas/notes.schema'


import * as bcrypt from 'bcryptjs'
import { LoginDto, OAuthLoginDto } from './dto/login-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private userModel: Model<User>,
    @InjectModel('Tasks') private tasksModel: Model<Tasks>,
    @InjectModel('Notes') private notesModel: Model<Notes>,

    private jwtService: JwtService
  ) { }

  // FUNCIONES PRIVADAS
  async #findUser(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email })
  }
  async #createUser(createUserDto: CreateUserDto | OAuthLoginDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(createUserDto)
      const notes = await this.notesModel.create({ user: newUser._id })
      const tasks = await this.tasksModel.create({ user: newUser._id })
      await this.userModel.findByIdAndUpdate(newUser._id, {
        notes: notes._id,
        tasks: tasks._id
      })
      return await newUser.save()
    } catch (error) {
      throw new UnauthorizedException(error, "Ocurrio un error al crear el usuario")
    }
  }
  async #singIn(payload: Buffer | object, options?: JwtSignOptions): Promise<{ token: string }> {
    return { token: await this.jwtService.signAsync(payload, options) }
  }



  // REGISTER
  async register(createUserDto: CreateUserDto): Promise<{ message: string, sucess: boolean }> {
    const { first_name, last_name, email, password } = createUserDto
    if (!first_name || !last_name || !email || !password) {
      throw new UnauthorizedException('No esta brindando los datos necesarios para crear un usuario')
    }

    const user = await this.#findUser(email)
    if (user) return { message: 'El correo ingresado ya se encuentra registado', sucess: false }

    const hashedPassword = await bcrypt.hash(password, 10)
    await this.#createUser({
      first_name, last_name, email,
      password: hashedPassword
    })

    return { message: 'Usuario creado correctamente. Ya puede iniciar sesión', sucess: true }
  }
  // LOGIN JWT
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password: pass } = loginDto

    const user = await this.#findUser(email)
    if (!user) throw new UnauthorizedException('Correo y/o contraseña incorrecta')

    const isPassMatched = await bcrypt.compare(pass, user.password)
    if (!isPassMatched) throw new UnauthorizedException('Correo y/o contraseña incorrecta')

    return await this.#singIn({ id: user._id }, { privateKey: process.env.JWT_SECRET })
  }
// LOGIN OAUTH20 PARA GOOGLE Y FACEBOOK
  async loginOAuth(userDto: OAuthLoginDto): Promise<{ token: string }> {
    if (!userDto._email) { throw new UnauthorizedException('Los datos brindados no son validos') }

    if (userDto._id) {
      return await this.#singIn({ id: userDto._id }, { privateKey: process.env.JWT_SECRET })
    }

    const newUser = await this.#createUser(userDto)
    return await this.#singIn({ id: newUser._id }, { privateKey: process.env.JWT_SECRET })
  }


}