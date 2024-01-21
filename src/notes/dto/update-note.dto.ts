import { PartialType } from '@nestjs/mapped-types';
import { CreateNotesDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNotesDto) {
}