import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  #cookieGenerate(req, res: Response, token: { token: string }) {
    res.cookie('token', token.token, {
      httpOnly: true,
      maxAge: 1296000000,
      sameSite: true,
      secure: false,
    })
    req.session.token = token.token
  }
  async #logOAuth(req, res: Response) {
    const token = await this.usersService.loginOAuth(req.user)
    this.#cookieGenerate(req, res, token)
    res.redirect(`${process.env.MODE === "prod"
        ? process.env.PROD_CLIENT_URL
        : process.env.DEV_CLIENT_URL
      }/api/account/oauth?accessToken=${token.token}`)
  }

  @Post('/register')
  signUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string, success: boolean }> {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  async login(
    @Req() req,
    @Body() loginDto: LoginDto,
    @Res() res: Response) {
    const token = await this.usersService.login(loginDto)
    this.#cookieGenerate(req, res, token)
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
  async facebookLogin() {
  }

  @Get('/auth/facebook/callback')
  @UseGuards(FacebookOauthGuard)
  async facebookCallback(
    @Req() req, @Res() res: Response
  ) {
    await this.#logOAuth(req, res)
  }


  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res: Response) {

    req.session.destroy(
      error => error ? res.json({ error })
        : res.clearCookie('token').status(HttpStatus.OK).json({ message: "Se ha desconectado correctamente!", success: true })
    )
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  current(@Req() req, @Res() res: Response) {
    res.json({
      session: req.session || false,
      user: req.user || false,
      cookie: req.cookie || req.cookies || false
    })
  }


}
