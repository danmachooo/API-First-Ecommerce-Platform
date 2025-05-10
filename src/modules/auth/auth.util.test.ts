import { sanitizeUser, sendAuthResponse } from "./auth.util";
import { mock } from "jest-mock-extended";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

describe("Auth Utilities", () => {
  describe("sanitizeUser", () => {
    it("should sanitize user object", () => {
      const user = {
        id: "1",
        email: "test@example.com",
        password: "secret",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER",
        createdAt: new Date(),
      };
      const sanitized = sanitizeUser(user);

      expect(sanitized).toEqual({
        id: "1",
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER",
        createdAt: expect.any(Date),
      });
      expect(sanitized).not.toHaveProperty("password");
    });
  });

  describe("sendAuthResponse", () => {
    it("should send auth response with token and user", () => {
      const res = mock<Response>({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn(),
      });
      const token = "jwt-token";
      const user = { id: "1", email: "test@example.com" };
      const message = "Logged in";

      sendAuthResponse(res, token, user, message);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        token,
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message,
        user,
      });
    });
  });
});
