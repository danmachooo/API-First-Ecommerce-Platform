// auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/prisma/user.service";
import { BadRequestError, NotFoundError } from "../../shared/utils/error.util";
import { StatusCodes } from "http-status-codes";
import { BcryptCryptoService, ICryptoService } from "./crypto.service";

import { handleSession } from "../../services/session.sevice";
import { sanitizeUser, sendAuthResponse } from "./auth.util";
import { Logger } from "../../shared/utils/logger";
import { AuthService } from "./auth.service";
import { ISessionStrategy } from "./session.strategy";
import { ResponseBuilder } from "../../shared/utils/response.util";
import { ConfigService } from "../../config/config.service";

/**
 * Handles HTTP requests for authentication operations.
 */
export class AuthController {
  constructor(
    private service: AuthService,
    private cryptoService: ICryptoService,
    private sessionStrategy: ISessionStrategy
  ) {}

  /**
   * Registers a new user with the provided credentials.
   * @throws BadRequestError if user already exists
   */
  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, firstname, lastname } = req.body;

    const existingUser = await this.service.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    const hashedPassword = await this.cryptoService.hashPassword(password);

    const user = await this.service.register({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    Logger.info(`User registered: ${email}`, "AuthController");
    res
      .status(StatusCodes.CREATED)
      .json(
        ResponseBuilder.success("A new user has been registered!", { user })
      );
  }

  /**
   * Logs in a user with email and password.
   * @throws NotFoundError if user not found or credentials invalid
   */
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await this.service.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    if (!user.password) {
      throw new NotFoundError("User is signed in via OAuth!");
    }

    const isMatch = await this.cryptoService.comparePassword(
      password,
      user.password
    );
    if (!isMatch) {
      throw new NotFoundError("Invalid credentials!");
    }

    const token = await this.sessionStrategy.createSession(user);
    const sanitizedUser = sanitizeUser(user);

    await this.service.saveSession(email, token);
    Logger.info(`User logged in: ${email}`, "AuthController");
    res
      .cookie("token", token, ConfigService.getCookieOptions())
      .status(StatusCodes.OK)
      .json(
        ResponseBuilder.success("You are logged in!", {
          user: sanitizedUser,
          token,
        })
      );
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    const token = req.cookies.token;

    if (!userId) throw new BadRequestError("No user is logged in.");

    await this.service.removeSession(userId, token);
    Logger.info(`User Logged out`, "AuthController");

    res
      .status(StatusCodes.OK)
      .clearCookie("token", ConfigService.getCookieOptions())
      .json(ResponseBuilder.success("User has been logged out!"));
  }
}
