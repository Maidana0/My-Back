import mongoose from "mongoose"
import User from "../../users/schemas/user.schema"
import { time } from "../../common/utils"
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"


@Schema()
export class Note {

    @Prop({ required: true })
    text: String

    @Prop({ type: Object, default: time() })
    date: Object
    
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