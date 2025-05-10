import { BcryptCryptoService } from "./crypto.service";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("BcryptCryptoService", () => {
  let service: BcryptCryptoService;

  beforeEach(() => {
    service = new BcryptCryptoService();
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "password123";
      const hashedPassword = "hashedPassword";
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe("comparePassword", () => {
    it("should return true if passwords match", async () => {
      const password = "password123";
      const hash = "hashedPassword";
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should return false if passwords do not match", async () => {
      const password = "password123";
      const hash = "hashedPassword";
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
