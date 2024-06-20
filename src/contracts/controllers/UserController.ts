import { Request, Response, NextFunction } from "express";

export interface IUserController {
  getUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
