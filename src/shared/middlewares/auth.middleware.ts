import redisClient from "../../lib/prisma/redis.lib";
import { verifyToken } from "../../modules/auth/jwt.util";
import { UnauthorizedError } from "../utils/error.util";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) throw new UnauthorizedError("No token provided.");
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) throw new UnauthorizedError("Token is invalid");
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
