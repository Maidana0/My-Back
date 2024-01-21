import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { NewMiddleware } from './common/middlewares/user.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    TasksModule,
    NotesModule,





  ],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NewMiddleware)
      .forRoutes({ path: 'user/signUp', method: RequestMethod.POST })

  }
}
