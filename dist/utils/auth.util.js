"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAuthResponse = exports.sanitizeUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const sanitizeUser = (user) => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    createdAt: user.createdAt,
    email: user.email,
    role: user.role,
});
exports.sanitizeUser = sanitizeUser;
const sendAuthResponse = (res, token, user, message) => {
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .json({
        success: true,
        message,
        user,
    });
};
exports.sendAuthResponse = sendAuthResponse;
