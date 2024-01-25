import { Controller, Get, Post, Body, Req, Query, Param, Delete, Put, UseGuards, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import Notes from './schemas/notes.schema';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('notes')
// @UseGuards(AuthGuard())
@UseGuards(JwtAuthGuard)

export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Get()
  getNotes(
    @Req() req,
    @Query('text') text: string,
    @Query('id') id: string

  ): Promise<Notes> {
    return this.notesService.getNotes(req.user.notes, text, id)
  }

  @Post()
  createNote(
    @Req() req,
    @Body() noteDto: NoteDto
  ): Promise<Notes> {
    return this.notesService.createNote(req.user.notes, noteDto)
  }


  @Put(':noteDate')
  updateNote(
    @Req() req,
    @Body() newNote: UpdateNoteDto,
    @Param('noteDate') noteDate: string
  ): Promise<Notes> {
    return this.notesService.updateNote(req.user.notes, noteDate, newNote)
  }

  @Delete(':noteDate')
  RemoveNote(
    @Req() req,
    @Param('noteDate') noteDate: string
  ): Promise<Notes> {
    return this.notesService.removeNote(req.user.notes, noteDate)
  }



}
