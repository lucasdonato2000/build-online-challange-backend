import express from "express";
import { AuthController } from "../controllers";

const authController = new AuthController();
const router = express.Router();

router.post("/login", authController.loginHandler);

export default router;
