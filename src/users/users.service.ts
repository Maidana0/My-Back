import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import User from './schemas/user.schema';
import Tasks from '../tasks/schemas/tasks.schema';

import Notes from '../notes/schemas/notes.schema'


import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login-user.dto';


// EL TOKEN OBTENIDO ES UTILZIADO PARA ENVIARLO EN CADA PETICION HTTP
// Y ASI PODER ACCEDER A LAS RUTAS PROTEGIDAS CON GUARDS
// EN CADA PETICION: Headers - Authorization: Bearer TOKEN

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private userModel: Model<User>,
    @InjectModel('Tasks') private tasksModel: Model<Tasks>,
    @InjectModel('Notes') private notesModel: Model<Notes>,

    private jwtService: JwtService
  ) { }

// NORMAL REGISTER JWT
  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { first_name, last_name, email, password } = signUpDto
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userModel.create({
      first_name, last_name, email,
      password: hashedPassword,
    })
    // TODAVIA NO SE COMO Y DONDE CREAR LOS ARCHIVOS DEL USUARIO ASI QUE POR AHORA LOS DEJO ACA...
    // ESTOY CREANDO Y GUARDANDO LOS ARCHIVOS DEL USUARIO
    const notes = await this.notesModel.create({ user: user._id })
    const tasks = await this.tasksModel.create({ user: user._id })

    await this.userModel.findByIdAndUpdate(user._id, { notes: notes._id, tasks: tasks._id })

    return {
      token: await this.jwtService.signAsync({ id: user._id })
    }
  }








  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password: pass } = loginDto
    const user = await this.userModel.findOne({ email })
    if (!user) { throw new UnauthorizedException('Correo y/o contraseña incorrecta') }

    const isPassMatched = await bcrypt.compare(pass, user.password)
    if (!isPassMatched) { throw new UnauthorizedException('Correo y/o contraseña incorrecta') }

    return {
      token: await this.jwtService.signAsync({ id: user._id })
    }
  }



  async findAll() {
    const users = this.userModel.find()
    return users
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    // const removeThis = await this.userModel.findOneAndDelete({id})
    // return removeThis
    return `This action removes a #${id} user`;
  }
}
