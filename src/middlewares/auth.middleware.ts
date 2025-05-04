import { verifyToken } from "../utils/jwt.util";
import { UnauthorizedError } from "../utils/error.util";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log("Cookie Token: ", token ?? "No token");
  if (!token) throw new UnauthorizedError("User not authenticated.");

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error("Auth middleware error: " + error);
    return next(new UnauthorizedError("Invalid or expired token."));
  }
};
