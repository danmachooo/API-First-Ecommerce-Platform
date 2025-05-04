"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const error_util_1 = require("../utils/error.util");
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Cookie Token: ", token ?? "No token");
    if (!token)
        throw new error_util_1.UnauthorizedError("User not authenticated.");
    try {
        const decoded = (0, jwt_util_1.verifyToken)(token);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error: " + error);
        return next(new error_util_1.UnauthorizedError("Invalid or expired token."));
    }
};
exports.authMiddleware = authMiddleware;
