import AppError from "../interfaces/appError";

export class UnauthorizedError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
