import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "helloworld";

export const generateToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, JWT_SECRET) as TokenPayload;
