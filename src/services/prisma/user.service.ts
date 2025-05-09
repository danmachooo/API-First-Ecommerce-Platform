import prisma from "../../lib/prisma/client.lib";
import { Role } from "../../generated/prisma";

import { IUser, IUserService } from "../interfaces/IUserService";

export class UserService implements IUserService {
  async createUser(data: {
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
  async saveSession(email: string, token: string) {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        sessionToken: token,
      },
    });
  }
  async removeSession(id: string) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        sessionToken: null,
      },
    });
  }
  async isLoggedIn(email: string) {
    console.log("Catched in Service: ", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        sessionToken: true,
      },
    });

    return !!user?.sessionToken;
  }
  async promoteUser(id: string): Promise<IUser> {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: "ADMIN",
      },
    });
  }
}
