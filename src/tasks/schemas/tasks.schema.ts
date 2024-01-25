import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose";
import User from "src/users/schemas/user.schema";


@Schema()
export class Task {
    @Prop({ required: true })
    task: String;

    @Prop({ default: false })
    sucess: Boolean;

    @Prop({ type: String, required: true})
    date: String

    @Prop({ default: "incomplete" })
    completeAt: String
}

export const TaskSchema = SchemaFactory.createForClass(Task)




@Schema()
export default class Tasks {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', require: true })
    user: User


    @Prop({ type: [TaskSchema], default: [] })
    tasks: Array<Task>
}

export const TasksSchema = SchemaFactory.createForClass(Tasks) 