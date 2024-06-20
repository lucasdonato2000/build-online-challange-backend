import express from "express";
import { AuthController } from "../controllers";
import { UserRepository } from "../repositories";
import { AuthService } from "../services";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const router = express.Router();

router.post("/login", authController.loginHandler);

export { router };
