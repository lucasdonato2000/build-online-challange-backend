import AppError from "../contracts/errors/appError";

export class NotFoundError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
