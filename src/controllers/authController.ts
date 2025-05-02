import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/Error";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/prisma/user.service";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

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
    console.error("An error occured.");
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

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new NotFoundError("User not found! Invalid Credentials.");
    }

    const token = generateToken({ userId: user.id, role: user.role });

    const sanitizedUser = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt,
      email: user.email,
      role: user.role,
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: "You are logged in!",
      token,
      user: sanitizedUser,
    });
  } catch (error: any) {
    console.error("An error occured.");
    next(error);
  }
};
