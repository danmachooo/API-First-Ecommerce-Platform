import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sanitizeUser = (user: any) => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  createdAt: user.createdAt,
  email: user.email,
  role: user.role,
});

export const sendAuthResponse = (
  res: Response,
  token: string,
  user: any,
  message: string
) => {
  res
    .status(StatusCodes.OK)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      success: true,
      message,
      user,
    });
};
