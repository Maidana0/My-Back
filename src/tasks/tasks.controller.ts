import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Tasks from './schemas/tasks.schema';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)

export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  getTasks(
    @Req() req,
    @Query('task') task: string
  ): Promise<Tasks> {
    return this.tasksService.getTasks(req.user.tasks, task)
  }

  @Post()
  createTask(
    @Req() req,
    @Body() taskDto: TaskDto
  ): Promise<Tasks> {
    return this.tasksService.createTask(req.user.tasks, taskDto)
  }

  @Put(':taskDate')
  updateTask(
    @Req() req,
    @Body() newTask: UpdateTaskDto,
    @Param('taskDate') taskDate: string
  ): Promise<Tasks> {
    return this.tasksService.updateTask(req.user.tasks, taskDate, newTask)
  }

  @Delete('taskDate')
  removeTask(
    @Req() req,
    @Param('taskDate') taskDate: string
  ): Promise<Tasks> {
    return this.tasksService.removeTask(req.user.tasks, taskDate)
  }






  // -----------------------------------------------------------
}
