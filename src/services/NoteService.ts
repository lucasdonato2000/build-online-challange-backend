import { Note } from "../contracts";
import { NoteRepository } from "../repositories";
import { v4 as uuidv4 } from "uuid";
import { INoteService } from "../contracts/services/NoteService";

export class NoteService implements INoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getNotes(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Note[]> {
    try {
      return await this.noteRepository.getNotesByUserId(userId, limit, offset);
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
    content: string
  ): Promise<Note> {
    try {
      const newNote: Note = {
        id: uuidv4(),
        userId,
        contactId,
        content: content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await this.noteRepository.addNote(newNote);
    } catch (error) {
      throw error;
    }
  }
}
