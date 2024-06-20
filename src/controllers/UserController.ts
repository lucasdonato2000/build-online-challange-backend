import { NextFunction, Request, Response } from "express";
import { IUserController } from "../contracts";
import { UserService } from "../services/UserService";

export class UserController implements IUserController {
  constructor(private userService: UserService) {}

  getUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const user = await this.userService.getUser(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
