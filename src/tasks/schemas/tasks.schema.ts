import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose";
import User from "src/users/schemas/user.schema";
import { TaskStatus } from "../entities/task.entity";


@Schema({ timestamps: true })
export class Task {
    @Prop({type: String })
    task: string;

    @Prop({ type: String,  enum: Object.values(TaskStatus), default: TaskStatus.PENDING })
    status: TaskStatus;
}

// export const TaskSchema = SchemaFactory.createForClass(Task)




@Schema()
export default class Tasks {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users", require: true })
    user: User


    @Prop({ type: [Task], default: [] })
    tasks: Array<Task>
}

export const TasksSchema = SchemaFactory.createForClass(Tasks) 