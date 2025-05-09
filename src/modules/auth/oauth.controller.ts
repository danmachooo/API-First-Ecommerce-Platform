import { Request, Response, NextFunction } from "express";

import { UserService } from "../../services/prisma/user.service";
import { handleSession } from "../../services/session.sevice";
import { sanitizeUser, sendAuthResponse } from "../../shared/utils/auth.util";
import { UnauthorizedError } from "../../shared/utils/error.util";
import { Logger } from "../../shared/utils/logger";

export class OAUTH {
  constructor(private service: UserService) {}
  async handleOAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      if (!user.email) throw new UnauthorizedError("Email missing");

      const token = await handleSession(user);
      console.debug("TOKEN FROM OAUTH: ", token);
      const sanitizedUser = sanitizeUser(user);

      await this.service.saveSession(user.email, token);

      sendAuthResponse(
        res,
        token,
        sanitizedUser,
        "You are logged in using OAUTH!"
      );
    } catch (error: any) {
      console.error("An error occured on OAuth.");
      Logger.error("An error occured on OAuth.", "OAuthController");
      next(error);
    }
  }
}
