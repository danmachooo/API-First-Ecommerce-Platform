"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const user_service_1 = require("../../services/prisma/user.service");
const passport_1 = __importDefault(require("passport"));
// Validate env vars before strategy initialization
if (!process.env.FB_CLIENT_ID || !process.env.FB_CLIENT_SECRET) {
    throw new Error("Missing Facebook OAuth credentials in environment");
}
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "/api/oauth/facebook/callback",
    profileFields: ["id", "emails", "name"],
}, async (_accessToken, _refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    if (!email)
        return done(null, false);
    let user = await user_service_1.UserService.findUserByEmail(email);
    if (!user) {
        user = await user_service_1.UserService.createUser({
            email,
            firstname: profile.name?.givenName || "Facebook",
            lastname: profile.name?.familyName || "User",
            provider: "facebook",
            providerId: profile.id,
        });
    }
    return done(null, user);
}));
