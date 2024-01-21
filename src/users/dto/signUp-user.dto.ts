import Notes from "src/notes/schemas/notes.schema"
import Tasks from "src/tasks/schemas/tasks.schema"

export class SignUpDto {

    readonly first_name: String

    readonly last_name: String

    readonly email: String

    readonly password: String

    readonly notes: Notes

    readonly tasks: Tasks
}