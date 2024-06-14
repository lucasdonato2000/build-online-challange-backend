import AppError from "../interfaces/appError";

export class MissingEnvError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "MissingEnvError";
    this.status = 500;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
