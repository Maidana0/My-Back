import User from "src/users/schemas/user.schema"
import { Task } from "../schemas/tasks.schema"


export class TaskDto {
    readonly task: String
    readonly sucess: Boolean
    readonly date: String
    readonly completeAt: String
}


export class CreateTasksDto {

    readonly user: User
    readonly tasks: Array<Task>

}
