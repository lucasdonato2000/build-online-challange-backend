import { Note } from "../entities/Note";

export interface INoteRepository {
  getNotesByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Note[]>;
  getNoteById(userId: string, noteId: string): Promise<Note | undefined>;
  addNote(note: Note): Promise<Note>;
}
