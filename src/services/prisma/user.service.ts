import prisma from "../../prisma/client";
import { User, Role } from "../../generated/prisma";

export const UserService = {
  async createUser(data: {
    email: string;
    password?: string | null;
    firstname: string;
    lastname: string;
    provider?: string | null;
    providerId?: string | null;
    role?: Role;
  }) {
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
  },

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
};
