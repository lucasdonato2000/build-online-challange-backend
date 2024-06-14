import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  getUserHandler = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await this.userService.getUser(req.user.id);
    res.json(user);
  };
}
