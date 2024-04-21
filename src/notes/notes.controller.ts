import { Controller, Get, Post, Body, Req, Query, Param, Delete, Put, UseGuards, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import Notes from './schemas/notes.schema';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { IResponseMessage } from 'src/common/utils';

@Controller('notes')
// @UseGuards(AuthGuard())
@UseGuards(JwtAuthGuard)

export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Get()
  getNotes(
    @Req() req,
    @Query('text') text?: string,
    @Query('sort') sort?: 1|-1,
  ): Promise<Notes> {
    return this.notesService.getNotes(req.user._notes, text, sort)
  }

  @Post()
  createNote(
    @Req() req,
    @Body() noteDto: NoteDto
  ): Promise<IResponseMessage> {
    return this.notesService.createNote(req.user._notes, noteDto)
  }


  @Put(':id')
  updateNote(
    @Req() req,
    @Body() newNote: UpdateNoteDto,
    @Param('id') id: string
  ): Promise<IResponseMessage> {
    return this.notesService.updateNote(req.user._notes, id, newNote)
  }

  @Delete(':id')
  RemoveNote(
    @Req() req,
    @Param('id') id: string
  ): Promise<IResponseMessage> {
    return this.notesService.removeNote(req.user._notes, id)
  }



}
