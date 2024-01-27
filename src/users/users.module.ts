import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { NotesSchema } from '../notes/schemas/notes.schema';
import { TasksSchema } from '../tasks/schemas/tasks.schema';
import { FaceboookStrategy } from './strategies/facebook.strategy';
import { Session } from './session/session.serialiser';
import { ValidateService } from './strategies/validateService';



@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
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

    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema },
      { name: 'Notes', schema: NotesSchema },
      { name: 'Tasks', schema: TasksSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy, 
    GoogleStrategy,
    FaceboookStrategy,
    Session,
    ValidateService
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class UsersModule { }
