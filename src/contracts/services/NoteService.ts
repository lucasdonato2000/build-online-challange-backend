import { Note } from "../entities/Note";

export interface INoteService {
  getNotes(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; notes: Note[] }>;
  getNote(userId: string, noteId: string): Promise<Note | undefined>;
  addNote(userId: string, contactId: string, content: string): Promise<Note>;
}
