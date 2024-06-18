import { Note } from "../interfaces";
import { NoteRepository } from "../repositories";
import { v4 as uuidv4 } from "uuid";

export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getNotes(userId: string): Promise<Note[]> {
    try {
      return await this.noteRepository.getNotesByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async getNote(userId: string, noteId: string): Promise<Note | undefined> {
    try {
      return await this.noteRepository.getNoteById(userId, noteId);
    } catch (error) {
      throw error;
    }
  }

  async addNote(
    userId: string,
    contactId: string,
    noteData: Partial<Note>
  ): Promise<Note> {
    try {
      const newNote: Note = {
        id: uuidv4(),
        userId,
        contactId,
        content: noteData.content!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await this.noteRepository.addNote(newNote);
    } catch (error) {
      throw error;
    }
  }

  async modifyNote(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    try {
      return await this.noteRepository.updateNote(userId, noteId, noteData);
    } catch (error) {
      throw error;
    }
  }
}
