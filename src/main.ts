import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session'
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session'

async function bootstrap() {
  const MongoDbStore = MongoDBStore(session)
  const store = new MongoDbStore({
    uri: process.env.DB_uri,
    collection: 'sessions'
  })

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
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
      store
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(4000);
}
bootstrap();
