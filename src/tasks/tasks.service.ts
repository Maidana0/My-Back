import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTasksDto, TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Tasks from './schemas/tasks.schema';
import { TaskStatus } from './entities/task.entity';
import { IResponseMessage, responseMessage } from 'src/common/utils';


@Injectable()
export class TasksService {
  constructor(@InjectModel("Tasks") private tasksModel: Model<Tasks>) { }
  async #userTasks(userId: string) { return await this.tasksModel.findById(userId) }


  async getTasks(tasksId: string, task: string, status: TaskStatus) {
    try {

      const tasks = await this.tasksModel.aggregate([
        { $match: { _id: tasksId } },
        { $unwind: '$tasks' },
        ...status ? [{ $match: { 'tasks.status': status } }] : [],
        ...task ? [{ $match: { 'tasks.task': { $regex: new RegExp(task, 'i') } } }] : [],
        { $group: { _id: '$_id', tasks: { $push: '$tasks' } } },
      ])
      return tasks[0]?.tasks || []
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al obtener las tareas. \n' + error.message)

    }
  }

  async createTask(tasksId: string, taskDto: TaskDto): Promise<IResponseMessage> {
    try {
      const newTask = await this.tasksModel.updateOne(
        { _id: tasksId },
        { $push: { tasks: taskDto } }
      )

      return newTask.modifiedCount === 1
        ? responseMessage(true, 'Tarea creada correctamente!')
        : responseMessage(false, 'Ocurrio un error al crear la tarea.')
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al crear la tarea. \n' + error.message)
    }
  }



  async updateTask(tasksId: string, id: string, newTask: UpdateTaskDto): Promise<IResponseMessage> {
    try {
      const { task, status } = newTask
      const updateTask = await this.tasksModel.updateOne(
        { _id: tasksId, "tasks._id": id },
        { $set: { "tasks.$.task": task, "tasks.$.status": status } }
      )

      return updateTask.modifiedCount === 1
        ? responseMessage(true, 'Tarea actualizada correctamente!')
        : responseMessage(false, 'Ocurrio un error al actualizar la tarea. \n Verifique el id de la tarea que desea actualizar.')
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al actualizar la tarea. \n' + error.message)
    }

  }
  // async updateTask(tasksId: string, taskDate: string, newTask: UpdateTaskDto): Promise<Tasks> {
  //   const { task, status, date, completeAt } = newTask

  //   if (!tasksId || !taskDate) {
  //     throw new HttpException("No esta brindando los datos necesarios para actualizar una tarea", HttpStatus.BAD_REQUEST)
  //   }

  //   const userTasks = await this.#userTasks(tasksId)
  //   const indexTask = userTasks.tasks.findIndex(task => task.date == taskDate)
  //   if (indexTask < 0) throw new HttpException("Tarea no encontrada. Revise su id", HttpStatus.NOT_FOUND)

  //   const updateTask = {
  //     task: task ? task : userTasks.tasks[indexTask].task,
  //     date: date ? date : userTasks.tasks[indexTask].date,
  //     completeAt: completeAt ? completeAt : userTasks.tasks[indexTask].completeAt,
  //     sucess
  //   }

  //   userTasks.tasks.splice(indexTask, 1, updateTask)

  //   return await userTasks.save()
  // }

  async deleteTask(tasksId: string, id: string): Promise<IResponseMessage> {
    try {
      const deleteTask = await this.tasksModel.updateOne(
        { _id: tasksId, "tasks._id": id },
        { $pull: { tasks: { _id: id } } }
      )

      return deleteTask.modifiedCount === 1
        ? responseMessage(true, "Tarea borrada correctamente!")
        : responseMessage(false, 'Ocurrio un error al borrar la tarea.')
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al borrar la tarea. \n' + error.message)
    }
  }

  // async removeTask(tasksId: string, taskDate: string): Promise<Tasks> {
  //   if (!tasksId || !taskDate) throw new HttpException("No esta brindando los datos necesarios para borrar una tarea", HttpStatus.BAD_REQUEST)
  //   const userTasks = await this.#userTasks(tasksId)

  //   const indexTask = userTasks.tasks.findIndex(task => task.date == taskDate)
  //   if (indexTask < 0) throw new HttpException("Tarea no encontrada, revise su id", HttpStatus.NOT_FOUND)

  //   userTasks.tasks.splice(indexTask, 1)
  //   return await userTasks.save()
  // }
  //-----------------------------------------------------------------

}
