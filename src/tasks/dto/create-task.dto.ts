import User from "src/users/schemas/user.schema"
import { Task } from "../schemas/tasks.schema"
import { IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator"
import { TaskStatus } from "../entities/task.entity"

export class TaskDto {
    @IsString()
    @IsNotEmpty()
    readonly task: string

    @IsOptional()
    @IsEnum(TaskStatus)
    readonly status: TaskStatus
}


export class CreateTasksDto {

    readonly user: User
    readonly tasks: Array<Task>

}
