import { AuthController } from "./auth.controller";
import { mockDeep, mock } from "jest-mock-extended";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ICryptoService } from "./crypto.service";
import { ISessionStrategy } from "./session.strategy";
import { BadRequestError, NotFoundError } from "../../shared/utils/error.util";
import { StatusCodes } from "http-status-codes";
import { ResponseBuilder } from "../../shared/utils/response.util";
import { ConfigService } from "../../config/config.service";
import { asyncHandler } from "../../shared/middlewares/asyncHandler.middleware";

describe("AuthController", () => {
  let controller: AuthController;
  let authServiceMock: ReturnType<typeof mockDeep<AuthService>>;
  let cryptoServiceMock: ReturnType<typeof mockDeep<ICryptoService>>;
  let sessionStrategyMock: ReturnType<typeof mockDeep<ISessionStrategy>>;
  let req: ReturnType<typeof mock<Request>>;
  let res: ReturnType<typeof mock<Response>>;
  let next: ReturnType<typeof mock<NextFunction>>;

  beforeEach(() => {
    authServiceMock = mockDeep<AuthService>();
    cryptoServiceMock = mockDeep<ICryptoService>();
    sessionStrategyMock = mockDeep<ISessionStrategy>();
    controller = new AuthController(
      authServiceMock,
      cryptoServiceMock,
      sessionStrategyMock
    );
    req = mock<Request>();
    res = mock<Response>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    });
    next = mock<NextFunction>();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
        firstname: "Test",
        lastname: "User",
      };
      authServiceMock.findUserByEmail.mockResolvedValue(null);
      cryptoServiceMock.hashPassword.mockResolvedValue("hashedPassword");
      authServiceMock.register.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER",
      } as any);

      await controller.register(req, res, next);

      expect(authServiceMock.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(cryptoServiceMock.hashPassword).toHaveBeenCalledWith(
        "password123"
      );
      expect(authServiceMock.register).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(
        ResponseBuilder.success("A new user has been registered!", {
          user: expect.any(Object),
        })
      );
    });

    it("should call next with BadRequestError if user already exists", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
        firstname: "Test",
        lastname: "User",
      };
      authServiceMock.findUserByEmail.mockResolvedValue({
        id: "1",
        email: "test@example.com",
      } as any);

      // Wrap the controller method with asyncHandler
      const handler = asyncHandler(controller.register.bind(controller));
      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("login", () => {
    it("should log in a user successfully", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      const user = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: "CUSTOMER",
      };
      authServiceMock.findUserByEmail.mockResolvedValue(user as any);
      cryptoServiceMock.comparePassword.mockResolvedValue(true);
      sessionStrategyMock.createSession.mockResolvedValue("jwt-token");
      authServiceMock.saveSession.mockResolvedValue(user as any);

      await controller.login(req, res, next);

      expect(authServiceMock.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(cryptoServiceMock.comparePassword).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(sessionStrategyMock.createSession).toHaveBeenCalledWith(user);
      expect(authServiceMock.saveSession).toHaveBeenCalledWith(
        "test@example.com",
        "jwt-token"
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "jwt-token",
        ConfigService.getCookieOptions()
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        ResponseBuilder.success("You are logged in!", {
          user: expect.any(Object),
          token: "jwt-token",
        })
      );
    });

    // For login tests:
    it("should call next with NotFoundError if user not found", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      authServiceMock.findUserByEmail.mockResolvedValue(null);

      const handler = asyncHandler(controller.login.bind(controller));
      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it("should call next with NotFoundError if user has no password (OAuth)", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      authServiceMock.findUserByEmail.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: null,
      } as any);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User is signed in via OAuth!" })
      );
    });

    it("should call next with NotFoundError if password is incorrect", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      authServiceMock.findUserByEmail.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
      } as any);
      cryptoServiceMock.comparePassword.mockResolvedValue(false);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Invalid credentials!" })
      );
    });
  });

  describe("logout", () => {
    it("should log out a user successfully", async () => {
      req.user = { id: "1", role: "CUSTOMER" };
      req.cookies = { token: "jwt-token" };
      authServiceMock.removeSession.mockResolvedValue({
        id: "1",
        email: "test@example.com",
      } as any);

      await controller.logout(req, res, next);

      expect(authServiceMock.removeSession).toHaveBeenCalledWith(
        "1",
        "jwt-token"
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        "token",
        ConfigService.getCookieOptions()
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        ResponseBuilder.success("User has been logged out!")
      );
    });

    it("should call next with BadRequestError if no user is logged in", async () => {
      req.user = undefined;
      req.cookies = { token: "jwt-token" };

      await controller.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "No user is logged in." })
      );
    });
  });
});
