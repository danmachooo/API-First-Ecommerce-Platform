import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  makeError,
} from "../../shared/utils/error.util";
import { StatusCodes } from "http-status-codes";

describe("Error Utilities", () => {
  describe("BadRequestError", () => {
    it("should create a BadRequestError and map to correct status code", () => {
      const error = new BadRequestError("Invalid input");
      const errorResponse = makeError(error);

      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe("Invalid input");
      expect(errorResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(errorResponse.error).toEqual({
        name: "BadRequestError",
        message: "Invalid input",
      });
    });
  });

  describe("NotFoundError", () => {
    it("should create a NotFoundError and map to correct status code", () => {
      const error = new NotFoundError("Resource not found");
      const errorResponse = makeError(error);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe("Resource not found");
      expect(errorResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(errorResponse.error).toEqual({
        name: "NotFoundError",
        message: "Resource not found",
      });
    });
  });

  describe("UnauthorizedError", () => {
    it("should create an UnauthorizedError and map to correct status code", () => {
      const error = new UnauthorizedError("Unauthorized access");
      const errorResponse = makeError(error);

      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe("Unauthorized access");
      expect(errorResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(errorResponse.error).toEqual({
        name: "UnauthorizedError",
        message: "Unauthorized access",
      });
    });
  });

  describe("ConflictError", () => {
    it("should create a ConflictError and map to correct status code", () => {
      const error = new ConflictError("Conflict occurred");
      const errorResponse = makeError(error);

      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe("Conflict occurred");
      expect(errorResponse.statusCode).toBe(StatusCodes.CONFLICT);
      expect(errorResponse.error).toEqual({
        name: "ConflictError",
        message: "Conflict occurred",
      });
    });
  });

  describe("ForbiddenError", () => {
    it("should create a ForbiddenError and map to correct status code", () => {
      const error = new ForbiddenError("Access forbidden");
      const errorResponse = makeError(error);

      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error.message).toBe("Access forbidden");
      expect(errorResponse.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(errorResponse.error).toEqual({
        name: "ForbiddenError",
        message: "Access forbidden",
      });
    });
  });

  describe("makeError", () => {
    it("should handle generic errors with INTERNAL_SERVER_ERROR", () => {
      const error = new Error("Unexpected error");
      const errorResponse = makeError(error);

      expect(errorResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(errorResponse.error).toEqual({
        name: "Error",
        message: "Unexpected error",
      });
    });

    it("should handle Malformed JSON errors with BAD_REQUEST", () => {
      const error = new Error("Malformed JSON in request");
      const errorResponse = makeError(error);

      expect(errorResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(errorResponse.error).toEqual({
        name: "Error",
        message: "Malformed JSON in request",
      });
    });
  });
});
