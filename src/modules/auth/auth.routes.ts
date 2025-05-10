// auth.router.ts
import express from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validation.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { asyncHandler } from "../../shared/middlewares/asyncHandler.middleware";
import { container } from "tsyringe";

const router = express.Router();
const auth = container.resolve(AuthController);
router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(auth.register.bind(auth))
);
router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(auth.login.bind(auth))
);
router.post("/logout", authMiddleware, asyncHandler(auth.logout.bind(auth)));

export default router;
