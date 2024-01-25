import { Controller, Get, Post, Body, Req, Res, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  #cookieGenerate(res: Response, token: { token: string }) {
    res.cookie('token', token.token, {
      httpOnly: true,
      maxAge: 1296000000,
      sameSite: true,
      secure: false,
    })
  }
  async #logOAuth(req, res: Response) {
    const token = await this.usersService.loginOAuth(req.user)
    this.#cookieGenerate(res, token)
    res.json(token).status(HttpStatus.OK)
  }

  @Post('/register')
  signUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string, sucess: boolean }> {
    return this.usersService.register(createUserDto);
  }

  @Get('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response) {
    const token = await this.usersService.login(loginDto)
    this.#cookieGenerate(res, token)
    res.json(token).status(HttpStatus.OK)
  }

  @Get('/google')
  @UseGuards(GoogleOauthGuard)
  googleLogin() { }

  @Get('/auth/google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(
    @Req() req, @Res() res: Response
  ) {
    await this.#logOAuth(req, res)
  }

  @Get('/facebook')
  @UseGuards(FacebookOauthGuard)
  async facebookLogin() { }

  @Get('/auth/facebook/callback')
  @UseGuards(FacebookOauthGuard)
  async facebookCallback(
    @Req() req, @Res() res: Response
  ) {
    await this.#logOAuth(req, res)
  }


  @Get('/logout')
  async logout(@Res() res){
    res.send("cerrar sesion en proceso xd")
  }





}
