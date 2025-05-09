import { Role } from "../../generated/prisma";

export interface IUserService {
  createUser(data: {
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
  saveSession(email: string, token: string): Promise<IUser>;
  removeSession(id: string): Promise<IUser>;
  isLoggedIn(email: string): Promise<boolean>;
  promoteUser(id: string): Promise<IUser>;
}

export interface IUser {
  id: string;
  email: string;
  password: string | null;
  firstname: string;
  lastname: string;
  role: Role;
  provider: string | null;
  providerId: string | null;
  sessionToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
