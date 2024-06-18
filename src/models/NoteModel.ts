import { Database } from "sqlite";
import { Note } from "../interfaces";
import { DatabaseError } from "../errors/DatabaseError";

export class NoteModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAllByUserId(userId: string): Promise<Note[]> {
    try {
      return await this.db.all<Note[]>("SELECT * FROM notes WHERE userId = ?", [
        userId,
      ]);
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

  async update(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    try {
      const note = await this.getById(userId, noteId);
      if (!note) return null;

      const updatedNote = { ...note, ...noteData };
      await this.db.run(
        "UPDATE notes SET content = ?, updatedAt = ? WHERE id = ? AND userId = ?",
        [updatedNote.content, updatedNote.updatedAt, noteId, userId]
      );
      return updatedNote;
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error updating note ${noteId} for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(
          `Error updating note ${noteId} for user ${userId}`
        );
      }
    }
  }
}
