import express from "express";
import { register, login } from "../controllers/Auth/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Import and use individual controller functions
router.post("/register", register);
router.post("/login", login);

export default router;
