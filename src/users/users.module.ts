import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NotesSchema } from '../notes/schemas/notes.schema';
import { TasksSchema } from '../tasks/schemas/tasks.schema';



@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES')
          }
        }
      }
    }),

    MongooseModule.forFeature([{
      name: 'Users',
      schema: UserSchema
    }]),

    MongooseModule.forFeature([{
      name: 'Notes',
      schema: NotesSchema
    }]),

    MongooseModule.forFeature([{
      name: 'Tasks',
      schema: TasksSchema
    }])
    
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class UsersModule { }
