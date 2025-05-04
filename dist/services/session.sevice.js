"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSession = void 0;
const error_util_1 = require("../utils/error.util");
const user_service_1 = require("./prisma/user.service");
const jwt_util_1 = require("../utils/jwt.util");
const handleSession = async (user) => {
    const isLoggedIn = await user_service_1.UserService.isLoggedIn(user.email);
    if (isLoggedIn) {
        throw new error_util_1.ConflictError("A session already exists. Please log out first.");
    }
    const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
    return token;
};
exports.handleSession = handleSession;
