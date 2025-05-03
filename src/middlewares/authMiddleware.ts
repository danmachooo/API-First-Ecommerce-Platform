import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/Error";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided."));
  }

  const token = authHeader.split(" ")[1];

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
