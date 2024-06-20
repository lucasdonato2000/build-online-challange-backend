import { Request, Response, NextFunction } from "express";

export interface INoteController {
  getNotesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getNoteHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addNoteHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
