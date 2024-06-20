import { Request, Response, NextFunction } from "express";

export interface IContactController {
  getContactsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getContactHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addContactHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateContactHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  urlMaker(req: Request, profilePicture: string): string;
}
