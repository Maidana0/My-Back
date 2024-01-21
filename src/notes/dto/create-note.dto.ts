import User from "../../users/schemas/user.schema"
import { Note } from "../schemas/notes.schema"

export class NoteDto {
    readonly text: string
    readonly date: Object
}

export class CreateNotesDto {
    readonly user: User
    readonly notes: Array<Note>
}
