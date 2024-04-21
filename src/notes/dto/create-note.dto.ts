import { IsNotEmpty, IsString } from "class-validator"
import User from "../../users/schemas/user.schema"
import { Note } from "../schemas/notes.schema"

export class NoteDto {
    @IsString()
    @IsNotEmpty()
    readonly text: String
}

export class CreateNotesDto {
    readonly user: User
    readonly notes: Array<Note>
}
