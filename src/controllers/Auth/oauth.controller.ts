import { Request, Response, NextFunction } from "express";

import { UserService } from "../../services/prisma/user.service";
import { handleSession } from "../../services/session.sevice";
import { sanitizeUser, sendAuthResponse } from "../../utils/auth.util";
import { UnauthorizedError } from "../../utils/error.util";

export const handleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!; // now typed
    if (!user.email) throw new UnauthorizedError("Email missing");

    const token = await handleSession(user);
    console.debug("TOKEN FROM OAUTH: ", token);
    const sanitizedUser = sanitizeUser(user);

    await UserService.saveSession(user.email, token);

    sendAuthResponse(
      res,
      token,
      sanitizedUser,
      "You are logged in using OAUTH!"
    );
  } catch (error: any) {
    console.error("An error occured on OAuth.");
    next(error);
  }
};
