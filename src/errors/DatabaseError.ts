import AppError from "../contracts/errors/appError";

export class DatabaseError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
    this.status = 500;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
