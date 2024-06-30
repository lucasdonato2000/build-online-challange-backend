import { NoteModel } from "../models/NoteModel";
import { INoteRepository, Note } from "../contracts";
import openDB from "../db/database";

export class NoteRepository implements INoteRepository {
  private noteModel: NoteModel | null = null;

  constructor() {
    openDB().then((db) => {
      this.noteModel = new NoteModel(db);
    });
  }

  private async getNoteModel(): Promise<NoteModel> {
    try {
      if (!this.noteModel) {
        const db = await openDB();
        this.noteModel = new NoteModel(db);
      }
      return this.noteModel;
    } catch (error) {
      throw error;
    }
  }

  async getNotesByUserId(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; notes: Note[] }> {
    try {
      const noteModel = await this.getNoteModel();
      return await noteModel.getAllByUserId(userId, limit, offset, searchTerm);
    } catch (error) {
      throw error;
    }
  }

  async getNoteById(userId: string, noteId: string): Promise<Note | undefined> {
    try {
      const noteModel = await this.getNoteModel();
      return await noteModel.getById(userId, noteId);
    } catch (error) {
      throw error;
    }
  }

  async addNote(note: Note): Promise<Note> {
    try {
      const noteModel = await this.getNoteModel();
      return await noteModel.create(note);
    } catch (error) {
      throw error;
    }
  }
}
