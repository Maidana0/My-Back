import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksDto, TaskDto } from './create-task.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(TaskDto) {
    @IsString()
    @IsOptional()
    readonly task: String

    @IsOptional()
    @IsString()
    readonly date: String
}
