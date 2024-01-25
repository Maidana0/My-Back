import { PartialType } from '@nestjs/mapped-types';
import { CreateNotesDto, NoteDto } from './create-note.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(NoteDto) {
    @IsString()
    @IsNotEmpty()
    readonly text: string
    // readonly date: string
}