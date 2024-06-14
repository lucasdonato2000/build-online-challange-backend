import NoteModel from "../models/NoteModel";
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
    if (!this.noteModel) {
      const db = await openDB();
      this.noteModel = new NoteModel(db);
    }
    return this.noteModel;
  }

  async getNotesByUserId(userId: string): Promise<Note[]> {
    const noteModel = await this.getNoteModel();
    return noteModel.getAllByUserId(userId);
  }

  async getNoteById(userId: string, noteId: string): Promise<Note | undefined> {
    const noteModel = await this.getNoteModel();
    return noteModel.getById(userId, noteId);
  }

  async addNote(note: Note): Promise<Note> {
    const noteModel = await this.getNoteModel();
    return noteModel.create(note);
  }

  async updateNote(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    const noteModel = await this.getNoteModel();
    return noteModel.update(userId, noteId, noteData);
  }
}
