import { mockDeep, mock } from "jest-mock-extended";
import { ISessionManagement } from "./auth.types";
import { ConfigService } from "../../config/config.service";
import { ConflictError } from "../../shared/utils/error.util";
import redisClientMock from "../../__mocks__/redis.mock";

jest.mock("../../lib/prisma/redis.lib", () => redisClientMock);

import { JwtSessionStrategy } from "./session.strategy";
describe("JwtSessionStrategy", () => {
  let strategy: JwtSessionStrategy;
  let sessionManagementMock: ReturnType<typeof mockDeep<ISessionManagement>>;
  let configServiceMock: ReturnType<typeof mock<ConfigService>>;

  beforeEach(() => {
    sessionManagementMock = mockDeep<ISessionManagement>();
    configServiceMock = mock<ConfigService>();
    strategy = new JwtSessionStrategy(sessionManagementMock, configServiceMock);
    jest.spyOn(ConfigService, "enforceSingleSession").mockReturnValue(true);
    jest.clearAllMocks();
  });

  describe("createSession", () => {
    it("should create a session if user is not logged in", async () => {
      const user = { id: "1", email: "test@example.com", role: "CUSTOMER" };
      sessionManagementMock.isLoggedIn.mockResolvedValue(false);

      const token = await strategy.createSession(user as any);

      expect(sessionManagementMock.isLoggedIn).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(token).toMatch(/^eyJ/); // JWT format
    });

    it("should throw ConflictError if user is already logged in and single-session is enforced", async () => {
      const user = { id: "1", email: "test@example.com", role: "CUSTOMER" };
      sessionManagementMock.isLoggedIn.mockResolvedValue(true);

      await expect(strategy.createSession(user as any)).rejects.toThrow(
        ConflictError
      );
      expect(sessionManagementMock.isLoggedIn).toHaveBeenCalledWith(
        "test@example.com"
      );
    });

    it("should create a session if single-session is not enforced", async () => {
      jest.spyOn(ConfigService, "enforceSingleSession").mockReturnValue(false);
      const user = { id: "1", email: "test@example.com", role: "CUSTOMER" };

      const token = await strategy.createSession(user as any);

      expect(sessionManagementMock.isLoggedIn).not.toHaveBeenCalled();
      expect(token).toMatch(/^eyJ/);
    });
  });

  describe("destroySession", () => {
    it("should blacklist a specific token", async () => {
      const userId = "1";
      const token = "jwt-token";
      redisClientMock.set.mockResolvedValue("OK");

      await strategy.destroySession(userId, token);

      expect(redisClientMock.set).toHaveBeenCalledWith(
        "blacklist:jwt-token",
        "true",
        "EX",
        24 * 60 * 60
      );
    });

    it("should do nothing if no token is provided", async () => {
      const userId = "1";

      await strategy.destroySession(userId);

      expect(redisClientMock.set).not.toHaveBeenCalled();
    });
  });
});
