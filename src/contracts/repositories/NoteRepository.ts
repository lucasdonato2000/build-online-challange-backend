import { Note } from "../entities/Note";

export interface INoteRepository {
  getNotesByUserId(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; notes: Note[] }>;
  getNoteById(userId: string, noteId: string): Promise<Note | undefined>;
  addNote(note: Note): Promise<Note>;
}
