import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotesDto, NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Notes from './schemas/notes.schema'

// RUTAS PROTEGIDAS
@Injectable()
export class NotesService {
  constructor(@InjectModel('Notes') private notesModel: Model<Notes>) { }


  async #notFoundException(param: any) { if (param) throw new NotFoundException("Notes not found") }
  async #userNotes(notesId: string) { return await this.notesModel.findById(notesId) }

  // OBTENER TODAS LAS NOTAS DE UN USUARIO
  async getNotes(notesId: string, text: string) {
    const notes = await this.notesModel.aggregate([
      { $match: { _id: notesId } },
      { $unwind: '$notes' },
      { $match: { 'notes.text': { $regex: new RegExp(text, 'i') } } },
      { $group: { _id: '$_id', notes: { $push: '$notes' } } }
    ])
    this.#notFoundException(!notes)
    return notes[0]?.notes || []
  }

  // CREAR UNA NOTA PARA EL USUARIO
  async createNote(notesId: string, noteDto: NoteDto): Promise<Notes> {
    const userNotes = await this.#userNotes(notesId)
    this.#notFoundException(!userNotes)
    userNotes.notes.push(noteDto)
    return await userNotes.save()
  }


  // async updateNote(notesId: string, dateNote: string, newNote: NoteDto): Promise<Notes> {
  //     const userNotes = await this.#userNotes(notesId)
  //     this.#notFoundException(!userNotes)


  //     const note = userNotes.notes.findIndex(note => note.date == dateNote)
  //     console.log(note)

  //     userNotes.notes.splice(note, 1, newNote)

  //     return await userNotes.save()
  // }

  async updateNote() {

  }

  async removeNote() {
  }
  //-----------------------------------------------------------------


  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const updateNote = await this.notesModel.findByIdAndUpdate(id, updateNoteDto, { new: true })
    if (!updateNote) {
      throw new NotFoundException("Note not found")
    }
    return updateNote
    // return `This action updates a #${id} note`;
  }

  async remove(id: string) {
    const removeNote = await this.notesModel.findByIdAndDelete(id)

    if (!removeNote) {
      throw new NotFoundException("Note not found")
    }

    return removeNote
    // return `This action removes a #${id} note`;
  }
}
