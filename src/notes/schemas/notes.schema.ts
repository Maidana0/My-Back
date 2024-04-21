import mongoose from "mongoose"
import User from "../../users/schemas/user.schema"
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"


@Schema({timestamps: true})
export class Note {
    @Prop({ required: true })
    text: String
}

export const NoteSchema = SchemaFactory.createForClass(Note)


@Schema()
export default class Notes {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', require: true })
    user: User


    @Prop({ type: [NoteSchema], default: [] })
    notes: Array<Note>
}

export const NotesSchema = SchemaFactory.createForClass(Notes)