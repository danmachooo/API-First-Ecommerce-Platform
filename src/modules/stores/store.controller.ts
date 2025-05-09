import { Request, Response, NextFunction } from "express";
import { StoreService } from "../../services/prisma/store.service";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../shared/utils/logger";
import { UserService } from "../../services/prisma/user.service";
import { NotFoundError } from "../../shared/utils/error.util";

export class StoreController {
  constructor(private service: StoreService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, ownerId } = req.body;

      //promote user first
      await new UserService().promoteUser(String(ownerId));

      const user = await new UserService().findUserById(ownerId);

      if (!user) {
        throw new NotFoundError("User not found.");
      }

      const store = await this.service.createStore({
        name,
        description,
        ownerId: user.id,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: `A new store has been registered in the name of ${user.firstname}!`,
        store,
      });
      Logger.info(`Store registered: ${store.name}`, "StoreController");
    } catch (error: any) {
      Logger.error(
        `Error on creating store in: ${error.message}`,
        "StoreController"
      );
      next(error);
    }
  }
}
