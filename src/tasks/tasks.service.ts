import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Tasks from './schemas/tasks.schema';
//
import { dateTime } from '../common/utils'
// ESTOY MANEJANDO ERRORES / QUEDA MANEJAR LOS ERRORES DE LAS TAREAS Y LUEGO HACER EL LOGIN CON FACEBOOK
@Injectable()
export class TasksService {
  constructor(@InjectModel("Tasks") private tasksModel: Model<Tasks>) { }
  async #userTasks(userId: string) { return await this.tasksModel.findById(userId) }


  async getTasks(tasksId: string, task: string) {
    const tasks = await this.tasksModel.aggregate([
      { $match: { _id: tasksId } },
      { $unwind: '$tasks' },
      { $match: { 'tasks.task': { $regex: new RegExp(task, 'i') } } },
      { $group: { _id: '$_id', tasks: { $push: '$tasks' } } }
    ])

    return tasks[0]?.tasks || []
  }

  async createTask(taskId: string, taskDto: TaskDto): Promise<Tasks> {
    if (!taskDto.task || !taskId) throw new HttpException("No esta brindando los datos necesarios para crear una tarea", HttpStatus.BAD_REQUEST)
    const userTasks = await this.#userTasks(taskId)

    userTasks.tasks.push(taskDto)

    //userTasks.tasks.push({task: taskDto.task, date: dateTime()})
    return await userTasks.save()
  }


  async updateTask(tasksId: string, taskDate: string, newTask: UpdateTaskDto): Promise<Tasks> {
    const { task, date, sucess, completeAt } = newTask
    if (!tasksId || !taskDate) {
      throw new HttpException("No esta brindando los datos necesarios para actualizar una tarea", HttpStatus.BAD_REQUEST)
    }

    const userTasks = await this.#userTasks(tasksId)
    const indexTask = userTasks.tasks.findIndex(task => task.date == taskDate)
    if (indexTask < 0) throw new HttpException("Tarea no encontrada. Revise su id", HttpStatus.NOT_FOUND)

    const updateTask = {
      task: task ? task : userTasks.tasks[indexTask].task,
      date: date ? date : userTasks.tasks[indexTask].date,
      completeAt: completeAt ? completeAt : userTasks.tasks[indexTask].completeAt,
      sucess: sucess ? sucess : userTasks.tasks[indexTask].sucess
    }

    userTasks.tasks.splice(indexTask, 1, updateTask)

    return await userTasks.save()
  }

  async removeTask(tasksId: string, taskDate: string): Promise<Tasks> {
    if (!tasksId || !taskDate) throw new HttpException("No esta brindando los datos necesarios para borrar una tarea", HttpStatus.BAD_REQUEST)
    const userTasks = await this.#userTasks(tasksId)

    const indexTask = userTasks.tasks.findIndex(task => task.date == taskDate)
    if (indexTask < 0) throw new HttpException("Tarea no encontrada, revise su id", HttpStatus.NOT_FOUND)
    
    userTasks.tasks.splice(indexTask, 1)
    return await userTasks.save()
  }
  //-----------------------------------------------------------------

}
