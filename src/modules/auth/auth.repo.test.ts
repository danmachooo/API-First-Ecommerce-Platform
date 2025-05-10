import prismaMock from "../../__mocks__/prisma.mock";
import redisClientMock from "../../__mocks__/redis.mock";
jest.mock("../../lib/prisma/client.lib", () => prismaMock);
jest.mock("../../lib/prisma/redis.lib", () => redisClientMock);

import { AuthRepo } from "./auth.repo";
import { NotFoundError } from "../../shared/utils/error.util";
import { Role } from "../../generated/prisma";

describe("AuthRepo", () => {
  let repo: AuthRepo;

  beforeEach(() => {
    repo = new AuthRepo();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const data = {
        email: "test@example.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER" as Role,
      };
      prismaMock.user.create.mockResolvedValue({ id: "1", ...data } as any);

      const result = await repo.register(data);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining(data),
      });
      expect(result).toEqual({ id: "1", ...data });
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const user = { id: "1", email: "test@example.com" };
      prismaMock.user.findUnique.mockResolvedValue(user as any);

      const result = await repo.findUserByEmail("test@example.com");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(user);
    });
  });

  describe("findUserById", () => {
    it("should find a user by ID", async () => {
      const user = { id: "1", email: "test@example.com" };
      prismaMock.user.findUnique.mockResolvedValue(user as any);

      const result = await repo.findUserById("1");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual(user);
    });
  });

  describe("saveSession", () => {
    it("should save a session", async () => {
      const user = { id: "1", email: "test@example.com" };
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.session.create.mockResolvedValue({
        id: "session1",
        userId: "1",
        token: "jwt-token",
      } as any);

      const result = await repo.saveSession("test@example.com", "jwt-token");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(prismaMock.session.create).toHaveBeenCalledWith({
        data: {
          userId: "1",
          token: "jwt-token",
          expiresAt: expect.any(Date),
        },
      });
      expect(result).toEqual(user);
    });

    it("should throw NotFoundError if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        repo.saveSession("test@example.com", "jwt-token")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("removeSession", () => {
    it("should remove a specific session by token", async () => {
      const user = { id: "1", email: "test@example.com" };
      const session = { id: "session1", userId: "1", token: "jwt-token" };
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.session.findUnique.mockResolvedValue(session as any);
      prismaMock.session.delete.mockResolvedValue(session as any);
      redisClientMock.set.mockResolvedValue("OK");

      const result = await repo.removeSession("1", "jwt-token");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
        where: { token: "jwt-token" },
      });
      expect(prismaMock.session.delete).toHaveBeenCalledWith({
        where: { id: "session1" },
      });
      expect(redisClientMock.set).toHaveBeenCalledWith(
        "blacklist:jwt-token",
        "true",
        "EX",
        24 * 60 * 60
      );
      expect(result).toEqual(user);
    });

    it("should remove all sessions for a user", async () => {
      const user = { id: "1", email: "test@example.com" };
      const sessions = [
        { id: "session1", userId: "1", token: "jwt-token1" },
        { id: "session2", userId: "1", token: "jwt-token2" },
      ];
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.session.findMany.mockResolvedValue(sessions as any);
      prismaMock.session.deleteMany.mockResolvedValue({ count: 2 });
      redisClientMock.set.mockResolvedValue("OK");

      const result = await repo.removeSession("1");

      expect(prismaMock.session.findMany).toHaveBeenCalledWith({
        where: { userId: "1" },
      });
      expect(redisClientMock.set).toHaveBeenCalledWith(
        "blacklist:jwt-token1",
        "true",
        "EX",
        24 * 60 * 60
      );
      expect(redisClientMock.set).toHaveBeenCalledWith(
        "blacklist:jwt-token2",
        "true",
        "EX",
        24 * 60 * 60
      );
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: "1" },
      });
      expect(result).toEqual(user);
    });

    it("should throw NotFoundError if user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(repo.removeSession("1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("isLoggedIn", () => {
    it("should return true if active sessions exist", async () => {
      prismaMock.session.findMany.mockResolvedValue([
        { id: "session1", token: "jwt-token" },
      ] as any);

      const result = await repo.isLoggedIn("test@example.com");

      expect(prismaMock.session.findMany).toHaveBeenCalledWith({
        where: {
          user: { email: "test@example.com" },
          expiresAt: { gt: expect.any(Date) },
        },
      });
      expect(result).toBe(true);
    });

    it("should return false if no active sessions exist", async () => {
      prismaMock.session.findMany.mockResolvedValue([]);

      const result = await repo.isLoggedIn("test@example.com");

      expect(result).toBe(false);
    });
  });
});
