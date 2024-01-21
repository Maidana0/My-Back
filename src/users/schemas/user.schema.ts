import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose'
import Notes from '../../notes/schemas/notes.schema'
import Tasks from '../../tasks/schemas/tasks.schema'
import mongoose, { Document } from 'mongoose'

@Schema({
    timestamps: true
})
export default class User extends Document {
    @Prop({ require: true })
    first_name: string

    @Prop({ require: true })
    last_name: string

    @Prop({ required: true, unique: true, index: true })
    email: string

    @Prop({ require: true })
    password: string


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Notes", })
    notes: Notes


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Tasks", })
    tasks: Tasks
}


export const UserSchema = SchemaFactory.createForClass(User)