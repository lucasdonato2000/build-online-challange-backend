import { NoteService } from "../../services/NoteService";
import { NoteRepository } from "../../repositories/NoteRepository";
import { ContactService } from "../../services/ContactService";
import { NotFoundError } from "../../errors";
import { Contact, Note } from "../../contracts";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../repositories/NoteRepository");
jest.mock("../../services/ContactService");

const mockNoteRepository = new NoteRepository() as jest.Mocked<NoteRepository>;
const mockContactService = new ContactService(
  {} as any
) as jest.Mocked<ContactService>;

const userId = "test-user-id";
const noteId = uuidv4();
const contactId = uuidv4();
const content = "Test note content";

let noteService: NoteService;

beforeEach(() => {
  noteService = new NoteService(mockNoteRepository, mockContactService);
});

describe("NoteService", () => {
  it("should handle repository errors when getting notes", async () => {
    const error = new Error("Database error");
    mockNoteRepository.getNotesByUserId.mockRejectedValueOnce(error);

    await expect(noteService.getNotes(userId, 10, 0, "")).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle repository errors when getting a note by ID", async () => {
    const error = new Error("Database error");
    mockNoteRepository.getNoteById.mockRejectedValueOnce(error);

    await expect(noteService.getNote(userId, noteId)).rejects.toThrow(
      "Database error"
    );
  });

  it("should throw NotFoundError when adding a note if contact is not found", async () => {
    mockContactService.getContact.mockResolvedValueOnce(undefined);

    await expect(
      noteService.addNote(userId, contactId, content)
    ).rejects.toThrow(new NotFoundError("Contact not found"));
  });

  it("should handle repository errors when adding a note", async () => {
    const contact: Contact = {
      id: contactId,
      userId,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: "john_doe.png",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockContactService.getContact.mockResolvedValueOnce(contact);
    const error = new Error("Database error");
    mockNoteRepository.addNote.mockRejectedValueOnce(error);

    await expect(
      noteService.addNote(userId, contactId, content)
    ).rejects.toThrow("Database error");
  });

  it("should add a note successfully", async () => {
    const contact: Contact = {
      id: contactId,
      userId,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: "john_doe.png",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockContactService.getContact.mockResolvedValueOnce(contact);
    const newNote: Note = {
      id: uuidv4(),
      userId,
      contactId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNoteRepository.addNote.mockResolvedValueOnce(newNote);

    const result = await noteService.addNote(userId, contactId, content);

    expect(result).toEqual(newNote);
    expect(mockNoteRepository.addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        contactId,
        content,
      })
    );
  });
});
