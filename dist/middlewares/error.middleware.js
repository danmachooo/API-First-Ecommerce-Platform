"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const error_util_1 = require("../utils/error.util");
const errorHandlerMiddleware = async (err, req, res, next) => {
    const { error, statusCode } = (0, error_util_1.makeError)(err);
    console.error(error.message, error);
    res.status(statusCode).json(error);
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
