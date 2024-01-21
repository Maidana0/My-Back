import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Tasks from './schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel("Tasks") private tasksModel: Model<Tasks>) { }

  async #notFoundException(param: any) { if (param) throw new NotFoundException("Tasks not found") }
  async #userTasks(userId: string) { return await this.tasksModel.findById(userId) }


  async getTasks(tasksId: string, task: string) {
      const tasks = await this.tasksModel.aggregate([
        { $match: { _id: tasksId } },
        { $unwind: '$tasks' },
        { $match: { 'tasks.task': { $regex: new RegExp(task, 'i') } } },
        { $group: { _id: '$_id', tasks: { $push: '$tasks' } } }
      ])
      this.#notFoundException(!tasks)
      return tasks[0]?.tasks || []
  }

  async createTask(taskId: string, taskDto: TaskDto): Promise<Tasks> {
      const userTasks = await this.#userTasks(taskId)
      this.#notFoundException(!userTasks)

      userTasks.tasks.push(taskDto)
      return await userTasks.save()
  }


  async updateTask(){
  }
  
  async removeTask(){
  }
  //-----------------------------------------------------------------



  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const updateTask = await this.tasksModel.findByIdAndUpdate(id, updateTaskDto, { new: true })

    if (!updateTask) {
      throw new NotFoundException("Task not found")
      // EN CASO DE NO ENCONTRAR LA TAREA, DEVOLVERA UN CODIGO 404 (Not Found)
      // CON EL MENSAJE PASADO COMO STRING 
    }

    return updateTask
    // return `This action updates a #${id} task`;
  }

  async remove(id: string) {
    const removeTask = await this.tasksModel.findByIdAndDelete(id)
    if (!removeTask) {
      throw new NotFoundException("Task not found")

    }

    return removeTask
    // return `This action removes a #${id} task`;
  }
}
