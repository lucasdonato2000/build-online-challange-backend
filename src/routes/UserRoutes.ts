import express from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRespository";
import { authMiddleware } from "../middleware/authMiddleware";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

router.use(authMiddleware);

router.get("/user", userController.getUserHandler);

export default router;
