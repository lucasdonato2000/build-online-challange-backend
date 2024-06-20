import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  loginHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
}
