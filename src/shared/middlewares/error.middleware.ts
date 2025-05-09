import { makeError } from "../utils/error.util";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

export const errorHandlerMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, statusCode } = makeError(err);
  console.error(error.message, error);

  res.status(statusCode).json(error);
};
