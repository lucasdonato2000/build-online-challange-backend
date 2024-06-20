import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { UnauthorizedError } from "../errors";
import { IAuthController } from "../contracts";

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  loginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.authenticateUser(email, password);
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
