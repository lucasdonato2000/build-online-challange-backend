import AppError from "../interfaces/appError";

export class BadRequestError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
