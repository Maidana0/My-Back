import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Tasks from './schemas/tasks.schema';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { TaskStatus } from './entities/task.entity';
import { IResponseMessage } from 'src/common/utils';

@Controller('tasks')
@UseGuards(JwtAuthGuard)

export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  getTasks(
    @Req() req,
    @Query('task') task: string,
    @Query('status') status: TaskStatus
  ) {
    return this.tasksService.getTasks(req.user._tasks, task, status)
  }

  @Post()
  createTask(
    @Req() req,
    @Body() taskDto: TaskDto
  ): Promise<IResponseMessage> {
    return this.tasksService.createTask(req.user._tasks, taskDto)
  }


  @Put(':id')
  updateTask(
    @Req() req,
    @Param('id') id: string,
    @Body() newTask: UpdateTaskDto,
  ): Promise<IResponseMessage> {
    return this.tasksService.updateTask(req.user._tasks, id, newTask)
  }

  @Delete(':id')
  deleteTask(
    @Req() req,
    @Param('id') id: string
  ): Promise<IResponseMessage> {
    return this.tasksService.deleteTask(req.user._tasks, id)
  }


  // -----------------------------------------------------------
}
