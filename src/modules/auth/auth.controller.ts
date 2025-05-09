// auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/prisma/user.service";
import { BadRequestError, NotFoundError } from "../../shared/utils/error.util";
import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../../shared/utils/hash.util";

import { handleSession } from "../../services/session.sevice";
import { sanitizeUser, sendAuthResponse } from "../../shared/utils/auth.util";
import { Logger } from "../../shared/utils/logger";

export class AuthController {
  constructor(private service: UserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstname, lastname } = req.body;

      const existingUser = await this.service.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestError("User already exists!");
      }

      const hashedPassword = await hashPassword(password);

      const user = await this.service.createUser({
        email,
        password: hashedPassword,
        firstname,
        lastname,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "A new user has been registered!",
        user,
      });
      Logger.info(`User registered: ${email}`, "AuthController");
    } catch (error: any) {
      Logger.error(
        `Error on registering user: ${error.message}`,
        "AuthController"
      );
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.service.findUserByEmail(email);
      if (!user) {
        throw new NotFoundError("User not found!");
      }

      if (!user.password) {
        throw new NotFoundError("User is signed in via OAuth!");
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new NotFoundError("Invalid credentials!");
      }

      const token = await handleSession(user);
      const sanitizedUser = sanitizeUser(user);

      await this.service.saveSession(email, token);
      sendAuthResponse(
        res,
        token,
        sanitizedUser,
        "You are logged in!: Manual AUTH"
      );
      Logger.info(`User logged in: ${email}`, "AuthController");
    } catch (error: any) {
      Logger.error(`Error on logging in: ${error.message}`, "AuthController");
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError("No user is logged in.");

      await this.service.removeSession(userId);
      res
        .status(StatusCodes.OK)
        .clearCookie("token")
        .json({ message: "User has been logged out!" });
      Logger.info(`User logged out: ${userId}`, "AuthController");
    } catch (error: any) {
      Logger.error(`Error on logging out: ${error.message}`, "AuthController");
      next(error);
    }
  }
}
