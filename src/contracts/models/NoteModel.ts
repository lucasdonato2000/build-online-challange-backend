import { Note } from "../entities/Note";

export interface INoteModel {
  getAllByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Note[]>;
  getById(userId: string, noteId: string): Promise<Note | undefined>;
  create(note: Note): Promise<Note>;
}
