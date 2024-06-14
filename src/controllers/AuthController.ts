import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/UserRespository";
import { AuthService } from "../services/AuthService";
import { UnauthorizedError } from "../errors";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
  loginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await authService.authenticateUser(email, password);
      if (token) {
        res.json({ token });
      } else {
        throw new UnauthorizedError("Invalid credentials");
      }
    } catch (error) {
      next(error);
    }
  };
}
