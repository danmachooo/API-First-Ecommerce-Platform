"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const oauth_controller_1 = require("../controllers/Auth/oauth.controller");
const router = express_1.default.Router();
// Google OAuth
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), oauth_controller_1.handleOAuthCallback);
// Facebook OAuth
router.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
}), oauth_controller_1.handleOAuthCallback);
exports.default = router;
