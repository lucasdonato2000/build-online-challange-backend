interface AppError extends Error {
  status: number;
  isOperational?: boolean;
}

export default AppError;
