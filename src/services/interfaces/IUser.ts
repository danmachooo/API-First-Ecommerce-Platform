import { Role } from "../../generated/prisma";

export interface IUser {
  id: string;
  email: string;
  password: string | null;
  firstname: string;
  lastname: string;
  role: Role;
  provider: string | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
