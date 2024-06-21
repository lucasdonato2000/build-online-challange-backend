import { Request, Response, NextFunction } from "express";
import { NoteController } from "../../controllers/NoteController";
import { NoteService } from "../../services/NoteService";
import { UnauthorizedError, NotFoundError } from "../../errors";
import { ContactRepository, NoteRepository } from "../../repositories";
import { ContactService } from "../../services";

jest.mock("../../services/NoteService");

let mockNoteRepository: jest.Mocked<NoteRepository>;
let mockContactService: jest.Mocked<ContactService>;
let mockContactRepository: jest.Mocked<ContactRepository>;
let mockNoteService: jest.Mocked<NoteService>;
let noteController: NoteController;
let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
  mockNoteRepository = new NoteRepository() as jest.Mocked<NoteRepository>;
  mockContactRepository =
    new ContactRepository() as jest.Mocked<ContactRepository>;
  mockContactService = new ContactService(
    mockContactRepository
  ) as jest.Mocked<ContactService>;
  mockNoteService = new NoteService(
    mockNoteRepository,
    mockContactService
  ) as jest.Mocked<NoteService>;
  noteController = new NoteController(mockNoteService);
  req = {};
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  next = jest.fn();
});

describe("NoteController Error Handling", () => {
  it("should call next with UnauthorizedError if req.user is not defined in getNotesHandler", async () => {
    await noteController.getNotesHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with UnauthorizedError if req.user is not defined in getNoteHandler", async () => {
    await noteController.getNoteHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with UnauthorizedError if req.user is not defined in addNoteHandler", async () => {
    await noteController.addNoteHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with NotFoundError in getNoteHandler if note is not found", async () => {
    req.user = { id: "1" };
    req.params = { noteId: "non-existent-id" };

    mockNoteService.getNote.mockResolvedValueOnce(undefined);

    await noteController.getNoteHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError("Note not found"));
  });

  it("should call next with Error in getNotesHandler if service throws an error", async () => {
    req.user = { id: "1" };
    req.query = { limit: "10", offset: "0" };

    const error = new Error("Database error");
    mockNoteService.getNotes.mockRejectedValueOnce(error);

    await noteController.getNotesHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next with Error in getNoteHandler if service throws an error", async () => {
    req.user = { id: "1" };
    req.params = { noteId: "1" };

    const error = new Error("Database error");
    mockNoteService.getNote.mockRejectedValueOnce(error);

    await noteController.getNoteHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next with Error in addNoteHandler if service throws an error", async () => {
    req.user = { id: "1" };
    req.params = { contactId: "1" };
    req.body = { content: "Test note" };

    const error = new Error("Database error");
    mockNoteService.addNote.mockRejectedValueOnce(error);

    await noteController.addNoteHandler(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
