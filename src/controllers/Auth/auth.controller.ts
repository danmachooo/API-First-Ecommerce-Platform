import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
} from "../../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../../services/prisma/user.service";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { generateToken } from "../../utils/jwt.util";
import { handleSession } from "../../services/session.sevice";
import { sanitizeUser, sendAuthResponse } from "../../utils/auth.util";
import { SrvRecord } from "dns";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      throw new BadRequestError("Required Fields are missing");
    }
    const existingUser = await UserService.findUserByEmail(email);

    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserService.createUser({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    if (user) {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "A new user has been registered!",
        user,
      });
    }
  } catch (error: any) {
    console.error("Error on registering user.");
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Required Fields are missing");
    }

    const user = await UserService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found!");
    }

    if (!user.password) {
      throw new NotFoundError("User not is signed in via OAuth!");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new NotFoundError("User not found! Invalid Credentials.");
    }

    const token = await handleSession(user);
    const sanitizedUser = sanitizeUser(user);

    await UserService.saveSession(email, token);
    sendAuthResponse(res, token, user, "You are logged in!: Manual AUTH");
  } catch (error: any) {
    console.error("Error on logging in.");
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestError("No user is logged in.");

    await UserService.removeSession(userId);
    res
      .status(StatusCodes.OK)
      .clearCookie("token")
      .json({ message: "User has been logged out!" });
  } catch (error) {
    next(error);
  }
};
