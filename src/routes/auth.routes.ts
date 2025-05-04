import express from "express";
import { register, login, logout } from "../controllers/Auth/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Import and use individual controller functions
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
