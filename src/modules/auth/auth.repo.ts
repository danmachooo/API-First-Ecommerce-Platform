import prisma from "../../lib/prisma/client.lib";
import { Role } from "../../generated/prisma";

import { IUser } from "../../services/interfaces/IUser";
import { IAuth, ISessionManagement } from "./auth.types";
import { NotFoundError } from "../../shared/utils/error.util";
import redisClient from "../../lib/prisma/redis.lib";
export class AuthRepo implements IAuth, ISessionManagement {
  async register(data: {
    email: string;
    password?: string | null;
    firstname: string;
    lastname: string;
    provider?: string | null;
    providerId?: string | null;
    role?: Role;
  }): Promise<IUser> {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password ?? null,
        firstname: data.firstname,
        lastname: data.lastname,
        role: data.role || "CUSTOMER",
        provider: data.provider,
        providerId: data.providerId || null,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
  async saveSession(email: string, token: string): Promise<IUser> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("User not found!");
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      },
    });
    return user;
  }
  async removeSession(id: string, token?: string): Promise<IUser> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User not found!");

    if (token) {
      const session = await prisma.session.findUnique({ where: { token } });
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
        await redisClient.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
      }
    } else {
      const sessions = await prisma.session.findMany({ where: { userId: id } });
      for (const session of sessions) {
        await redisClient.set(
          `blacklist:${session.token}`,
          "true",
          "EX",
          24 * 60 * 60
        );
      }
      await prisma.session.deleteMany({ where: { userId: id } });
    }

    return user;
  }

  async isLoggedIn(email: string): Promise<boolean> {
    const sessions = await prisma.session.findMany({
      where: { user: { email }, expiresAt: { gt: new Date() } },
    });
    return sessions.length > 0;
  }
}
