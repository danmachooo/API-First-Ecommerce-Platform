// shared/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { z, AnyZodObject } from "zod";
import { BadRequestError } from "../utils/error.util";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        throw new BadRequestError(`Validation failed: ${errorMessage}`);
      }
      next(error);
    }
  };
};
