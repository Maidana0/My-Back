import User from "src/users/schemas/user.schema"
import { Task } from "../schemas/tasks.schema"
import { IsNotEmpty, IsString } from "class-validator"


export class TaskDto {
    @IsString()
    @IsNotEmpty()
    readonly task: String
    
    readonly sucess: Boolean

    @IsString()
    @IsNotEmpty()
    readonly date: String

    readonly completeAt: String
}


export class CreateTasksDto {

    readonly user: User
    readonly tasks: Array<Task>

}
