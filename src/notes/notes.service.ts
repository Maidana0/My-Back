import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotesDto, NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Notes from './schemas/notes.schema'
//
import { dateTime } from '../common/utils';
// RUTAS PROTEGIDAS
@Injectable()
export class NotesService {
  constructor(@InjectModel('Notes') private notesModel: Model<Notes>) { }


  async #userNotes(notesId: string) { return await this.notesModel.findById(notesId) }

  // OBTENER TODAS LAS NOTAS DE UN USUARIO
  async getNotes(notesId: string, text: string, date: string) {
    const notes = await this.notesModel.aggregate([
      { $match: { _id: notesId } },
      { $unwind: '$notes' },
      { $match: { 'notes.text': { $regex: new RegExp(text, 'i') } } },
      { $match: { 'notes.date': { $regex: new RegExp(date, 'i') } } },

      { $group: { _id: '$_id', notes: { $push: '$notes' } } }
    ])
    return notes[0]?.notes || []
  }

  // CREAR UNA NOTA PARA EL USUARIO
  async createNote(notesId: string, noteDto: NoteDto): Promise<Notes> {
    if (!noteDto.text || !notesId) throw new HttpException("No esta brindando los datos necesarios para crear una nota", HttpStatus.BAD_REQUEST)
    const userNotes = await this.#userNotes(notesId)
    userNotes.notes.push(noteDto)
    // PARA PRODUCCION = 
    // userNotes.notes.push({text: noteDto.text, date: dateTime()})
    return await userNotes.save()
  }


  async updateNote(notesId: string, noteDate: string, newNote: UpdateNoteDto): Promise<Notes> {
    if (!newNote.text || !noteDate || !notesId) throw new HttpException('No esta brindando los datos necesarios para actualizar una nota', HttpStatus.BAD_REQUEST)

    const userNotes = await this.#userNotes(notesId)

    const indexNote = userNotes.notes.findIndex(note => note.date == noteDate)
    if (indexNote < 0) throw new HttpException('Nota no encontrada. Revise su id', HttpStatus.NOT_FOUND)

    userNotes.notes.splice(indexNote, 1, {
      text: newNote.text,
      date: newNote.date ? newNote.date : userNotes.notes[indexNote].date
    })
    return await userNotes.save()

  }

  async removeNote(notesId: string, noteDate: string): Promise<Notes> {
    if (!noteDate || !notesId) throw new HttpException('No esta brindando los datos necesarios para borrar una nota', HttpStatus.BAD_REQUEST)

    const userNotes = await this.#userNotes(notesId)
    const indexNote = userNotes.notes.findIndex(note => note.date == noteDate)
    if (indexNote < 0) throw new HttpException('Nota no encontrada. Revise su id', HttpStatus.NOT_FOUND)

    userNotes.notes.splice(indexNote, 1)
    return await userNotes.save()
  }

}
