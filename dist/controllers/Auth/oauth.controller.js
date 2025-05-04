"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOAuthCallback = void 0;
const user_service_1 = require("../../services/prisma/user.service");
const session_sevice_1 = require("../../services/session.sevice");
const auth_util_1 = require("../../utils/auth.util");
const error_util_1 = require("../../utils/error.util");
const handleOAuthCallback = async (req, res, next) => {
    try {
        if (!req.user || !req.user.email) {
            throw new error_util_1.UnauthorizedError("Authentication failed or email missing.");
        }
        const user = req.user;
        const token = await (0, session_sevice_1.handleSession)(user);
        console.debug("TOKEN FROM OAUTH: ", token);
        const sanitizedUser = (0, auth_util_1.sanitizeUser)(user);
        await user_service_1.UserService.saveSession(user.email, token);
        (0, auth_util_1.sendAuthResponse)(res, token, sanitizedUser, "You are logged in using OAUTH!");
    }
    catch (error) {
        console.error("An error occured on OAuth.");
        next(error);
    }
};
exports.handleOAuthCallback = handleOAuthCallback;
