import express, { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import OAuthRoutes from "./OAuthRoutes";

const router: Router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/oauth", OAuthRoutes);

export default router;
