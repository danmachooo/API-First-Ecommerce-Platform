import { AuthService } from "./auth.service";
import { mockDeep } from "jest-mock-extended";
import { AuthRepo } from "./auth.repo";
import { ICryptoService } from "./crypto.service";
import { ISessionStrategy } from "./session.strategy";
import { Role } from "../../generated/prisma";

describe("AuthService", () => {
  let service: AuthService;
  let repoMock: ReturnType<typeof mockDeep<AuthRepo>>;
  let cryptoServiceMock: ReturnType<typeof mockDeep<ICryptoService>>;
  let sessionStrategyMock: ReturnType<typeof mockDeep<ISessionStrategy>>;

  beforeEach(() => {
    repoMock = mockDeep<AuthRepo>();
    cryptoServiceMock = mockDeep<ICryptoService>();
    sessionStrategyMock = mockDeep<ISessionStrategy>();
    service = new AuthService(repoMock, cryptoServiceMock, sessionStrategyMock);
  });

  describe("register", () => {
    it("should register a user", async () => {
      const data = {
        email: "test@example.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER" as Role,
      };
      repoMock.register.mockResolvedValue({ id: "1", ...data } as any);

      const result = await service.register(data);

      expect(repoMock.register).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: "1", ...data });
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const user = { id: "1", email: "test@example.com" };
      repoMock.findUserByEmail.mockResolvedValue(user as any);

      const result = await service.findUserByEmail("test@example.com");

      expect(repoMock.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(result).toEqual(user);
    });

    it("should return null if user not found", async () => {
      repoMock.findUserByEmail.mockResolvedValue(null);

      const result = await service.findUserByEmail("test@example.com");

      expect(result).toBeNull();
    });
  });

  describe("findUserById", () => {
    it("should find a user by ID", async () => {
      const user = { id: "1", email: "test@example.com" };
      repoMock.findUserById.mockResolvedValue(user as any);

      const result = await service.findUserById("1");

      expect(repoMock.findUserById).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });
  });

  describe("saveSession", () => {
    it("should save a session", async () => {
      const user = { id: "1", email: "test@example.com" };
      repoMock.saveSession.mockResolvedValue(user as any);

      const result = await service.saveSession("test@example.com", "jwt-token");

      expect(repoMock.saveSession).toHaveBeenCalledWith(
        "test@example.com",
        "jwt-token"
      );
      expect(result).toEqual(user);
    });
  });

  describe("removeSession", () => {
    it("should remove a session with token", async () => {
      const user = { id: "1", email: "test@example.com" };
      sessionStrategyMock.destroySession.mockResolvedValue();
      repoMock.removeSession.mockResolvedValue(user as any);

      const result = await service.removeSession("1", "jwt-token");

      expect(sessionStrategyMock.destroySession).toHaveBeenCalledWith(
        "1",
        "jwt-token"
      );
      expect(repoMock.removeSession).toHaveBeenCalledWith("1", "jwt-token");
      expect(result).toEqual(user);
    });

    it("should remove a session without token", async () => {
      const user = { id: "1", email: "test@example.com" };
      sessionStrategyMock.destroySession.mockResolvedValue();
      repoMock.removeSession.mockResolvedValue(user as any);

      const result = await service.removeSession("1");

      expect(sessionStrategyMock.destroySession).toHaveBeenCalledWith(
        "1",
        undefined
      );
      expect(repoMock.removeSession).toHaveBeenCalledWith("1", undefined);
      expect(result).toEqual(user);
    });
  });

  describe("isLoggedIn", () => {
    it("should return true if user is logged in", async () => {
      repoMock.isLoggedIn.mockResolvedValue(true);

      const result = await service.isLoggedIn("test@example.com");

      expect(repoMock.isLoggedIn).toHaveBeenCalledWith("test@example.com");
      expect(result).toBe(true);
    });

    it("should return false if user is not logged in", async () => {
      repoMock.isLoggedIn.mockResolvedValue(false);

      const result = await service.isLoggedIn("test@example.com");

      expect(result).toBe(false);
    });
  });
});
