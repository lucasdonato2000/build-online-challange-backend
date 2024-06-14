import { Database } from "sqlite";
import { Note } from "../interfaces";

class NoteModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAllByUserId(userId: string): Promise<Note[]> {
    return this.db.all<Note[]>("SELECT * FROM notes WHERE userId = ?", [
      userId,
    ]);
  }

  async getById(userId: string, noteId: string): Promise<Note | undefined> {
    return this.db.get<Note>(
      "SELECT * FROM notes WHERE id = ? AND userId = ?",
      [noteId, userId]
    );
  }

  async create(note: Note): Promise<Note> {
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
  }

  async update(
    userId: string,
    noteId: string,
    noteData: Partial<Note>
  ): Promise<Note | null> {
    const note = await this.getById(userId, noteId);
    if (!note) return null;

    const updatedNote = { ...note, ...noteData };
    await this.db.run(
      "UPDATE notes SET content = ?, updatedAt = ? WHERE id = ? AND userId = ?",
      [updatedNote.content, updatedNote.updatedAt, noteId, userId]
    );
    return updatedNote;
  }
}

export default NoteModel;
