import express from "express";
import passport, { use } from "passport";
import { OAUTH } from "./oauth.controller";
import { UserService } from "../../services/prisma/user.service";
import user from "../../lib/prisma/user.lib";

const router = express.Router();

const oauth = new OAUTH(user);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  oauth.handleOAuthCallback.bind(oauth)
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  oauth.handleOAuthCallback.bind(oauth)
);

export default router;
