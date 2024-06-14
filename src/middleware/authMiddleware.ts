import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
