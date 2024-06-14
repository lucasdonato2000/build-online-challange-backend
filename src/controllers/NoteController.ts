import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, NotFoundError } from "../errors";
import { NoteService } from "../services/NoteService";

export class NoteController {
  constructor(private noteService: NoteService) {}

  getNotesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const notes = await this.noteService.getNotes(req.user.id);
      res.json(notes);
    } catch (error) {
      next(error);
    }
  };

  getNoteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const note = await this.noteService.getNote(
        req.user.id,
        req.params.noteId
      );
      if (note) {
        res.json(note);
      } else {
        throw new NotFoundError("Note not found");
      }
    } catch (error) {
      next(error);
    }
  };

  createNoteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const newNote = await this.noteService.addNote(
        req.user.id,
        req.params.contactId,
        req.body
      );
      res.status(201).json(newNote);
    } catch (error) {
      next(error);
    }
  };

  updateNoteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const updatedNote = await this.noteService.modifyNote(
        req.user.id,
        req.params.noteId,
        req.body
      );
      if (updatedNote) {
        res.json(updatedNote);
      } else {
        throw new NotFoundError("Note not found");
      }
    } catch (error) {
      next(error);
    }
  };
}
