import { Database } from "sqlite";
import { INoteModel, Note } from "../contracts";
import { DatabaseError } from "../errors/DatabaseError";

export class NoteModel implements INoteModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAllByUserId(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; notes: Note[] }> {
    try {
      const totalResult = await this.db.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM notes WHERE userId = ? AND content LIKE ?",
        [userId, `%${searchTerm}%`]
      );
      const notes = await this.db.all<Note[]>(
        "SELECT * FROM notes WHERE userId = ? AND content LIKE ? LIMIT ? OFFSET ?",
        [userId, `%${searchTerm}%`, limit, offset]
      );
      return { total: totalResult?.count ?? 0, notes };
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching notes for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(`Error fetching notes for user ${userId}`);
      }
    }
  }

  async getById(userId: string, noteId: string): Promise<Note | undefined> {
    try {
      return await this.db.get<Note>(
        "SELECT * FROM notes WHERE id = ? AND userId = ?",
        [noteId, userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching note ${noteId} for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(
          `Error fetching note ${noteId} for user ${userId}`
        );
      }
    }
  }

  async create(note: Note): Promise<Note> {
    try {
      await this.db.run(
        "INSERT INTO notes (id, userId, contactId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [
          note.id,
          note.userId,
          note.contactId,
          note.content,
          note.createdAt,
          note.updatedAt,
        ]
      );
      return note;
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error creating note for user ${note.userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(`Error creating note for user ${note.userId}`);
      }
    }
  }
}
