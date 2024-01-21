import { Controller, Get, Post, Request, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signUp-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }




  @Post('/signUp')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.usersService.signUp(signUpDto);
  }
  // @Post()
  // create(@Body() signUpDto: SignUpDto) {
  //   return this.usersService.create(signUpDto);
  // }






  @Get('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.usersService.login(loginDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
