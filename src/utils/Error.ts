import { StatusCodes } from "http-status-codes";

type ErrorResponse = {
  statusCode: (typeof StatusCodes)[keyof typeof StatusCodes];
  error: {
    name: string;
    message: string;
  };
};

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.message = message;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.message = message;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.message = message;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.message = message;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export function makeError(error: Error): ErrorResponse {
  const defaultError = {
    name: error.name,
    message: error.message,
  };

  //Custom Errors
  if (error instanceof BadRequestError) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: { name: error.name, message: error.message },
    };
  }

  if (
    error.message.includes("Malformed JSON") &&
    !(error instanceof BadRequestError)
  ) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: { name: error.name, message: error.message },
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      error: { name: error.name, message: error.message },
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      error: { name: error.name, message: error.message },
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      error: { name: error.name, message: error.message },
    };
  }

  if (error instanceof ConflictError) {
    return {
      statusCode: StatusCodes.CONFLICT,
      error: { name: error.name, message: error.message },
    };
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    error: { name: error.name, message: error.message },
  };
}
