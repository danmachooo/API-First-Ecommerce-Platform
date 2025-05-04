import express, { Router } from "express";
import AuthRoutes from "./auth.routes";
import OAuthRoutes from "./oauth.routes";

const router: Router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/oauth", OAuthRoutes);

export default router;
