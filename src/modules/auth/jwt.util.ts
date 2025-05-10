import jwt, { SignOptions } from "jsonwebtoken";
import { ConfigService } from "../../config/config.service";
import { SigningOptions } from "crypto";

interface TokenPayload {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "helloworld";

export function generateToken(
  payload: { userId: string; role: string },
  options: jwt.SignOptions = {
    expiresIn: ConfigService.getJwtExpiration() as SignOptions["expiresIn"],
  }
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  return jwt.sign(payload, JWT_SECRET, options);
}

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, JWT_SECRET) as TokenPayload;
