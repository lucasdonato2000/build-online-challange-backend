import { Request, Response, NextFunction } from "express";
import AppError from "../interfaces/appError";

function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const status = err.status || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  res.status(status).json({ message });
}

export default errorHandler;
