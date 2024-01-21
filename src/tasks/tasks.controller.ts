import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import Tasks from './schemas/tasks.schema';

@Controller('tasks')
@UseGuards(AuthGuard())

export class TasksController {
  constructor(private readonly tasksService: TasksService) { }
  
  @Get()
  getTasks(@Req() req, @Query('task') task: string): Promise<Tasks> {
    return this.tasksService.getTasks(req.user.tasks, task)
  }
  
  @Post()
  createTask(@Req() req, @Body() taskDto: TaskDto): Promise<Tasks> {
    return this.tasksService.createTask(req.user.tasks, taskDto)
  }








  
  // -----------------------------------------------------------
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
