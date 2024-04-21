import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotesDto, NoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Notes from './schemas/notes.schema'
import { responseMessage, IResponseMessage } from 'src/common/utils';
// RUTAS PROTEGIDAS
@Injectable()
export class NotesService {
  constructor(@InjectModel('Notes') private notesModel: Model<Notes>) { }


  async #userNotes(notesId: string) { return await this.notesModel.findById(notesId) }

  // OBTENER TODAS LAS NOTAS DE UN USUARIO
  async getNotes(notesId: string, text?: string, sort?: 1|-1) {
    try {

      const aggregationStages: any[] = [{ $match: { _id: notesId } }, { $unwind: '$notes' },]
      if (text) aggregationStages.push({ $match: { 'notes.text': { $regex: new RegExp(text, 'i') } } })
      if (sort == 1 || sort == -1) aggregationStages.push({ $sort: { 'notes.updatedAt': Number(sort) } })
      aggregationStages.push({ $group: { _id: '$_id', notes: { $push: '$notes' } } });  

      const notes = await this.notesModel.aggregate(aggregationStages)

      return notes[0]?.notes || []
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al obtener las notas. \n' + error.message)
    }
  }

  // CREAR UNA NOTA PARA EL USUARIO
  async createNote(notesId: string, noteDto: NoteDto): Promise<IResponseMessage> {
    try {
      const newNote = await this.notesModel.updateOne(
        { _id: notesId },
        { $push: { notes: noteDto } }
      )
      
      return newNote.modifiedCount === 1
        ? responseMessage(true, 'Nota creada correctamente!')
        : responseMessage(false, 'Ocurrio un error al crear la nota.')
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al crear la nota. \n' + error.message)
    }
  }

  async updateNote(notesId: string, id: string, newNote: UpdateNoteDto): Promise<IResponseMessage> {
    try {
      const updateNote = await this.notesModel.updateOne(
        { _id: notesId, "notes._id": id },
        { $set: { "notes.$.text": newNote.text } }
      )

      return updateNote.modifiedCount === 1
        ? responseMessage(true, 'Nota actualizada correctamente!')
        : responseMessage(false, 'Ocurrio un error al actualizar la nota. \n Verifique el id de la nota que desea actualizar.')



    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al actualizar la nota. \n' + error.message)
    }
  }

  async removeNote(notesId: string, id: string): Promise<IResponseMessage> {
    try {
      const deleteNote = await this.notesModel.updateOne(
        { _id: notesId, "notes._id": id },
        { $pull: { notes: { _id: id } } }
      )

      return deleteNote.modifiedCount === 1
        ? responseMessage(true, "Nota borrada correctamente!")
        : responseMessage(false, 'Ocurrio un error al borrar la nota.')
    } catch (error) {
      return responseMessage(false, 'Ocurrio un error al borrar la nota. \n' + error.message)
    }
  }

}
