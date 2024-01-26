import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  // app.set('trust proxy', 1) // trust first proxy PARA QUE SOLO ADMITA HTTPS
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: +process.env.SESSION_MAX_AGE,
        //  secure: true PARA QUE SOLO ADMITA HTTPS
      },
      // store: PARA UTILIZAR MONGO STORE
    })
  )
  await app.listen(4000);
}
bootstrap();
