import { NoteModel } from "../models/NoteModel";
import { Note } from "../contracts";
import openDB from "../db/database";

export class NoteRepository {
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
    offset: number
  ): Promise<Note[]> {
    try {
      const noteModel = await this.getNoteModel();
      const notes = await noteModel.getAllByUserId(userId, limit, offset);
      notes.map((note) => {
        note.createdAt = new Date(note.createdAt);
        note.updatedAt = new Date(note.updatedAt);
      });
      return notes;
    } catch (error) {
      throw error;
    }
  }

  async getNoteById(userId: string, noteId: string): Promise<Note | undefined> {
    try {
      const noteModel = await this.getNoteModel();
      const note = await noteModel.getById(userId, noteId);
      if (note) {
        note.createdAt = new Date(note.createdAt);
        note.updatedAt = new Date(note.updatedAt);
      }
      return note;
    } catch (error) {
      throw error;
    }
  }

  async addNote(note: Note): Promise<Note> {
    try {
      const noteModel = await this.getNoteModel();
      return noteModel.create(note);
    } catch (error) {
      throw error;
    }
  }
}
