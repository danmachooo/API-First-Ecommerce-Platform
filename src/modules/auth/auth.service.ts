import e from "express";
import { Role } from "../../generated/prisma";
import { IAuth, ISessionManagement } from "./auth.types";
import { IUser } from "../../services/interfaces/IUser";
import { AuthRepo } from "./auth.repo";
import { ICryptoService } from "./crypto.service";
import { ISessionStrategy } from "./session.strategy";

export class AuthService implements IAuth, ISessionManagement {
  constructor(
    private repo: AuthRepo,
    private cryptoService: ICryptoService,
    private sessionStrategy: ISessionStrategy
  ) {}

  async register(data: {
    email: string;
    password?: string | null;
    firstname: string;
    lastname: string;
    provider?: string | null;
    providerId?: string | null;
    role?: Role;
  }): Promise<IUser> {
    return await this.repo.register(data);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.repo.findUserByEmail(email);
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await this.repo.findUserById(id);
  }

  async saveSession(email: string, token: string): Promise<IUser> {
    return await this.repo.saveSession(email, token);
  }

  async removeSession(id: string, token?: string): Promise<IUser> {
    await this.sessionStrategy.destroySession(id, token);
    return await this.repo.removeSession(id, token);
  }

  async isLoggedIn(email: string): Promise<boolean> {
    return await this.repo.isLoggedIn(email);
  }
}
