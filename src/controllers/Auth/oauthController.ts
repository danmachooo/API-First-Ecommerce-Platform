import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { UnauthorizedError } from "../../utils/Error";
import { Role } from "../../generated/prisma";

interface AuthenticatedUser {
  id: string;
  role: Role;
}

export const handleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      throw new UnauthorizedError("Authentication Failed");
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OAuth login successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error("An error occured on OAuth.");
    next(error);
  }
};
