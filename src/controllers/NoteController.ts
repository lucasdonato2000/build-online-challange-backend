import { Request, Response, NextFunction } from "express";
import { INoteController } from "../contracts";
import { UnauthorizedError, NotFoundError } from "../errors";
import { NoteService } from "../services/NoteService";

export class NoteController implements INoteController {
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

      const { limit = "10", offset = "0" } = req.query;

      const limitNumber = Number(limit);
      const offsetNumber = Number(offset);

      const notes = await this.noteService.getNotes(
        req.user.id,
        limitNumber,
        offsetNumber
      );
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

  addNoteHandler = async (
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
        req.body.content
      );
      res.status(201).json({
        ...newNote,
      });
    } catch (error) {
      next(error);
    }
  };
}
