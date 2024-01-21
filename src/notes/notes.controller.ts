import { Controller, Get, Post, Body, Req, Query, Param, Delete, Put, UseGuards, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import Notes from './schemas/notes.schema';

@Controller('notes')
@UseGuards(AuthGuard())

export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Get()
  getNotes(@Req() req, @Query('text') text: string): Promise<Notes> {
    return this.notesService.getNotes(req.user.notes, text)
  }

  @Post()
  createNote(@Req() req, @Body() noteDto: NoteDto): Promise<Notes> {
    return this.notesService.createNote(req.user.notes, noteDto)
  }


  // @Put(':dateNote')
  // updateNote(@Req() req, @Body() noteUpdate: UpdateNoteDto, @Param('dateNote') dateNote: string): Promise<Notes> {
  //   return this.notesService.updateNote(req.user.notes, dateNote, noteUpdate)
  // }




  // ---------------------------------------------------------------------


  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
  //   return this.notesService.update(id, updateNoteDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
