import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Tasks from './schemas/tasks.schema';
import { IResponseMessage, responseMessage } from 'src/common/utils';


@Injectable()
export class TasksService {
  constructor(@InjectModel("Tasks") private tasksModel: Model<Tasks>) { }
  async #userTasks(userId: string) { return await this.tasksModel.findById(userId) }


  async getTasks(tasksId: string, { task, status, category }: TaskDto): Promise<TaskDto[] | IResponseMessage> {
    try {

      const tasks = await this.tasksModel.aggregate([
        { $match: { _id: tasksId } },
        { $unwind: '$tasks' },
        ...status ? [{ $match: { 'tasks.status': status } }] : [],
        ...category ? [{ $match: { 'tasks.category': category } }] : [],
        ...task ? [{ $match: { 'tasks.task': { $regex: new RegExp(task, 'i') } } }] : [],
        { $group: { _id: '$_id', tasks: { $push: '$tasks' } } },
      ])
      return tasks[0]?.tasks || []
    } catch (error) {
      return responseMessage(
        false, 'Ocurrio un error al obtener las tareas. \n' + error.message, HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getCategories(tasksId: string): Promise<String[] | IResponseMessage> {
    try {
      const categories = await this.tasksModel.aggregate([
        { $match: { _id: tasksId } },
        { $unwind: '$tasks' },
        { $group: { _id: '$_id', categories: { $addToSet: '$tasks.category' } } },
        { $project: { _id: 0, categories: 1 } }
      ])
      return categories[0]?.categories || []
    }
    catch (error) {
      return responseMessage(
        false, 'Ocurrio un error al obtener las categorias. \n' + error.message, HttpStatus.INTERNAL_SERVER_ERROR
      )
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
      return responseMessage(
        false, 'Ocurrio un error interno al crear la tarea. \n' + error.message, HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }



  async updateTask(tasksId: string, id: string, newTask: UpdateTaskDto): Promise<IResponseMessage> {
    try {
      const { task, status, category } = newTask
      const updateTask = await this.tasksModel.updateOne(
        { _id: tasksId, "tasks._id": id },
        {
          $set: {
            "tasks.$.task": task,
            "tasks.$.status": status,
            "tasks.$.category": category
          }
        }
      )

      return updateTask.modifiedCount === 1
        ? responseMessage(true, 'Tarea actualizada correctamente!')
        : responseMessage(false, 'Ocurrio un error al actualizar la tarea. \n Verifique el id de la tarea que desea actualizar.')
    } catch (error) {
      return responseMessage(
        false, 'Ocurrio un error al actualizar la tarea. \n' + error.message, HttpStatus.INTERNAL_SERVER_ERROR
      )
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
      return responseMessage(
        false, 'Ocurrio un error al borrar la tarea. \n' + error.message, HttpStatus.INTERNAL_SERVER_ERROR
      )
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
