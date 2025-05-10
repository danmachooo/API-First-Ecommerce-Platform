import { ConflictError } from "../shared/utils/error.util";
import { UserService } from "./prisma/user.service";
import { generateToken } from "../modules/auth/jwt.util";
import userService from "../lib/prisma/user.lib";

export const handleSession = async (user: any): Promise<string> => {
  const isLoggedIn = await userService.isLoggedIn(user.email);

  if (isLoggedIn) {
    throw new ConflictError("A session already exists. Please log out first.");
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return token;
};
