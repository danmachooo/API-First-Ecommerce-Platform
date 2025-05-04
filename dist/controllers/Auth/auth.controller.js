"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const error_util_1 = require("../../utils/error.util");
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../../services/prisma/user.service");
const hash_util_1 = require("../../utils/hash.util");
const session_sevice_1 = require("../../services/session.sevice");
const auth_util_1 = require("../../utils/auth.util");
const register = async (req, res, next) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !firstname || !lastname) {
            throw new error_util_1.BadRequestError("Required Fields are missing");
        }
        const existingUser = await user_service_1.UserService.findUserByEmail(email);
        if (existingUser) {
            throw new error_util_1.BadRequestError("User already exists!");
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(password);
        const user = await user_service_1.UserService.createUser({
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });
        if (user) {
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                success: true,
                message: "A new user has been registered!",
                user,
            });
        }
    }
    catch (error) {
        console.error("Error on registering user.");
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_util_1.BadRequestError("Required Fields are missing");
        }
        const user = await user_service_1.UserService.findUserByEmail(email);
        if (!user) {
            throw new error_util_1.NotFoundError("User not found!");
        }
        if (!user.password) {
            throw new error_util_1.NotFoundError("User not is signed in via OAuth!");
        }
        const isMatch = await (0, hash_util_1.comparePassword)(password, user.password);
        if (!isMatch) {
            throw new error_util_1.NotFoundError("User not found! Invalid Credentials.");
        }
        const token = await (0, session_sevice_1.handleSession)(user);
        const sanitizedUser = (0, auth_util_1.sanitizeUser)(user);
        await user_service_1.UserService.saveSession(email, token);
        (0, auth_util_1.sendAuthResponse)(res, token, user, "You are logged in!: Manual AUTH");
    }
    catch (error) {
        console.error("Error on logging in.");
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const loggedInUser = req.user?.id; // Optional chaining
        console.log("ID: ", loggedInUser);
        if (loggedInUser || loggedInUser !== undefined) {
            await user_service_1.UserService.removeSession(loggedInUser);
            console.log("Cookie has been removed!");
            res.status(http_status_codes_1.StatusCodes.OK).clearCookie("token").json({
                message: "User has been logged out!",
            });
        }
        else {
            throw new error_util_1.BadRequestError("No user is logged in.");
        }
    }
    catch (error) {
        console.log("Error on logging out.");
        next(error);
    }
};
exports.logout = logout;
