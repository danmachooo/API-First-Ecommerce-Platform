import { Role } from "../../generated/prisma";
import { IUser } from "../../services/interfaces/IUser";

export interface IAuth {
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
}

export interface ISessionManagement {
  saveSession(email: string, token: string): Promise<IUser>;
  removeSession(id: string, token?: string): Promise<IUser>;
  isLoggedIn(email: string): Promise<boolean>;
}
