"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
exports.UserService = {
    async createUser(data) {
        return await client_1.default.user.create({
            data: {
                email: data.email,
                password: data.password ?? null,
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role || "CUSTOMER",
                provider: data.provider,
                providerId: data.providerId || null,
            },
        });
    },
    async findUserByEmail(email) {
        return await client_1.default.user.findUnique({
            where: {
                email,
            },
        });
    },
    async findUserById(id) {
        return await client_1.default.user.findUnique({
            where: {
                id,
            },
        });
    },
    async saveSession(email, token) {
        return await client_1.default.user.update({
            where: {
                email: email,
            },
            data: {
                sessionToken: token,
            },
        });
    },
    async removeSession(id) {
        return await client_1.default.user.update({
            where: {
                id: id,
            },
            data: {
                sessionToken: null,
            },
        });
    },
    async isLoggedIn(email) {
        console.log("Catched in Service: ", email);
        const user = await client_1.default.user.findUnique({
            where: {
                email: email,
            },
            select: {
                sessionToken: true,
            },
        });
        return !!user?.sessionToken;
    },
};
