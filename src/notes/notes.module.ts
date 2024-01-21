import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesSchema } from './schemas/notes.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature(
      [{ name: 'Notes', schema: NotesSchema }]
    )
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule { }
