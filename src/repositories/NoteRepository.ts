import { NoteModel } from "../models/NoteModel";
import { Note } from "../interfaces";
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

  async getNotesByUserId(userId: string): Promise<Note[]> {
    try {
      const noteModel = await this.getNoteModel();
      return noteModel.getAllByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async getNoteById(userId: string, noteId: string): Promise<Note | undefined> {
    try {
      const noteModel = await this.getNoteModel();
      return noteModel.getById(userId, noteId);
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

  async updateNote(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    try {
      const noteModel = await this.getNoteModel();
      return noteModel.update(userId, noteId, noteData);
    } catch (error) {
      throw error;
    }
  }
}
