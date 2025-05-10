import { generateToken, verifyToken } from "./jwt.util";
import jwt, { SignOptions } from "jsonwebtoken";
import { ConfigService } from "../../config/config.service";

jest.mock("jsonwebtoken");

describe("jwt.util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    jest.spyOn(ConfigService, "getJwtExpiration").mockReturnValue("7d");
  });

  describe("generateToken", () => {
    it("should generate a JWT token", () => {
      const payload = { userId: "1", role: "CUSTOMER" };
      const token = "jwt-token";
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = generateToken(payload, {
        expiresIn: ConfigService.getJwtExpiration() as SignOptions["expiresIn"],
      });

      expect(jwt.sign).toHaveBeenCalledWith(payload, "test-secret", {
        expiresIn: "7d",
      });
      expect(result).toBe(token);
    });

    it("should throw error if JWT_SECRET is not set", () => {
      delete process.env.JWT_SECRET;

      expect(() => generateToken({ userId: "1", role: "CUSTOMER" })).toThrow(
        "JWT_SECRET is required"
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify a JWT token", () => {
      const token = "jwt-token";
      const payload = { userId: "1", role: "CUSTOMER" };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, "test-secret");
      expect(result).toEqual(payload);
    });

    it("should throw error if token is invalid", () => {
      const token = "invalid-token";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => verifyToken(token)).toThrow("Invalid token");
    });
  });
});
