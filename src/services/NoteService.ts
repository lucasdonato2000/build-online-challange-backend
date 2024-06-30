import { INoteService, Note } from "../contracts";
import { NoteRepository } from "../repositories";
import { v4 as uuidv4 } from "uuid";
import { ContactService } from "./ContactService";
import { NotFoundError } from "../errors";

export class NoteService implements INoteService {
  constructor(
    private noteRepository: NoteRepository,
    private contactService: ContactService
  ) {}

  async getNotes(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; notes: Note[] }> {
    try {
      return await this.noteRepository.getNotesByUserId(
        userId,
        limit,
        offset,
        searchTerm
      );
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
      const contact = await this.contactService.getContact(userId, contactId);
      if (!contact) {
        throw new NotFoundError("Contact not found");
      }
      const newNote: Note = {
        id: uuidv4(),
        userId,
        contactId,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return await this.noteRepository.addNote(newNote);
    } catch (error) {
      throw error;
    }
  }
}
