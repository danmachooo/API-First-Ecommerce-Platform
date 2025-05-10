import { ConfigService } from "./config.service";

describe("ConfigService", () => {
  beforeEach(() => {
    process.env.JWT_EXPIRES_IN = "7d";
  });

  describe("getJwtExpiration", () => {
    it("should return JWT expiration from environment", () => {
      expect(ConfigService.getJwtExpiration()).toBe("7d");
    });

    it("should return default expiration if not set", () => {
      delete process.env.JWT_EXPIRES_IN;
      expect(ConfigService.getJwtExpiration()).toBe("7d");
    });
  });

  describe("getCookieOptions", () => {
    it("should return cookie options", () => {
      const options = ConfigService.getCookieOptions();
      expect(options).toEqual({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "strict",
        maxAge: expect.any(Number),
      });
    });
  });

  describe("enforceSingleSession", () => {
    it("should return true if single-session is enforced", () => {
      process.env.ENFORCE_SINGLE_SESSION = "true";
      expect(ConfigService.enforceSingleSession()).toBe(true);
    });

    it("should return false if single-session is not enforced", () => {
      process.env.ENFORCE_SINGLE_SESSION = "false";
      expect(ConfigService.enforceSingleSession()).toBe(false);
    });
  });
});
