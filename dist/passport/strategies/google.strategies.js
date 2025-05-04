"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_service_1 = require("../../services/prisma/user.service");
const passport_1 = __importDefault(require("passport"));
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials in environment");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/oauth/google/callback",
}, async (_accessToken, _refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    if (!email)
        return done(null, false);
    try {
        let user = await user_service_1.UserService.findUserByEmail(email);
        if (!user) {
            user = await user_service_1.UserService.createUser({
                email,
                firstname: profile.name?.givenName || "Google",
                lastname: profile.name?.familyName || "User",
                provider: "google",
                providerId: profile.id,
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
