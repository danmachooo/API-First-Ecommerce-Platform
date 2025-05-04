"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
exports.makeError = makeError;
const http_status_codes_1 = require("http-status-codes");
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.message = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.message = message;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.message = message;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.message = message;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.message = message;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
function makeError(error) {
    const defaultError = {
        name: error.name,
        message: error.message,
    };
    //Custom Errors
    if (error instanceof BadRequestError) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            error: { name: error.name, message: error.message },
        };
    }
    if (error.message.includes("Malformed JSON") &&
        !(error instanceof BadRequestError)) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            error: { name: error.name, message: error.message },
        };
    }
    if (error instanceof UnauthorizedError) {
        return {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            error: { name: error.name, message: error.message },
        };
    }
    if (error instanceof ForbiddenError) {
        return {
            statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
            error: { name: error.name, message: error.message },
        };
    }
    if (error instanceof NotFoundError) {
        return {
            statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
            error: { name: error.name, message: error.message },
        };
    }
    if (error instanceof ConflictError) {
        return {
            statusCode: http_status_codes_1.StatusCodes.CONFLICT,
            error: { name: error.name, message: error.message },
        };
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        error: { name: error.name, message: error.message },
    };
}
