// auth.router.ts
import express from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validation.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import user from "../../lib/prisma/user.lib";

const router = express.Router();
const auth = new AuthController(user);

router.post(
  "/register",
  validateRequest(registerSchema),
  auth.register.bind(auth)
);
router.post("/login", validateRequest(loginSchema), auth.login.bind(auth));
router.post("/logout", authMiddleware, auth.logout.bind(auth));

export default router;
