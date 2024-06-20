import AppError from "../contracts/errors/appError";

export class MissingEnvError extends Error implements AppError {
  status: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = "MissingEnvError";
    this.status = 500;
    this.isOperational = false;

    Error.captureStackTrace(this, this.constructor);
  }
}
