import bcrypt from "bcrypt";

export interface ICryptoService {
  hashPassword(string: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

export class BcryptCryptoService implements ICryptoService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
