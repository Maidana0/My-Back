import { TaskDto } from './create-task.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends TaskDto {
    @IsString()
    @IsOptional()
    readonly task: string


}
