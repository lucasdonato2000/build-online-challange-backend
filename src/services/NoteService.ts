import { Note } from "../interfaces";
import { NoteRepository } from "../repositories/NoteRepository";
import { v4 as uuidv4 } from "uuid";

export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getNotes(userId: string): Promise<Note[]> {
    return await this.noteRepository.getNotesByUserId(userId);
  }

  async getNote(userId: string, noteId: string): Promise<Note | undefined> {
    return await this.noteRepository.getNoteById(userId, noteId);
  }

  async addNote(
    userId: string,
    contactId: string,
    noteData: Partial<Note>
  ): Promise<Note> {
    const newNote: Note = {
      id: uuidv4(),
      userId,
      contactId,
      content: noteData.content!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.noteRepository.addNote(newNote);
  }

  async modifyNote(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    return await this.noteRepository.updateNote(userId, noteId, noteData);
  }
}
