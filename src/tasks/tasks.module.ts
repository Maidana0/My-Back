import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksSchema } from './schemas/tasks.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature(
      [{ name: "Tasks", schema: TasksSchema }]
    )
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule { }
