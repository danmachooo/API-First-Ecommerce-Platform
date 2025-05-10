import { Role } from "../../generated/prisma";
import { IUser } from "./IUser";

export interface IUserService {
  register(data: {
    email: string;
    password?: string | null;
    firstname: string;
    lastname: string;
    provider?: string | null;
    providerId?: string | null;
    role?: Role;
  }): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  promoteUser(id: string): Promise<IUser>;
}
