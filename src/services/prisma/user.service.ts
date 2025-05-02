import prisma from "../../prisma/client";
import { User, Role } from "../../generated/prisma";

export const UserService = {
  async createUser(data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role?: Role;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        role: data.role || "CUSTOMER",
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
