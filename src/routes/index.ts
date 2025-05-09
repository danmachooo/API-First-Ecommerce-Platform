import express, { Router } from "express";
import AuthRoutes from "../modules/auth/auth.routes";
import OAuthRoutes from "../modules/auth/oauth.routes";
import StoreRoutes from "../modules/stores/store.routes";

const router: Router = express.Router();
router.use("/auth", AuthRoutes);
router.use("/oauth", OAuthRoutes);
router.use("/store", StoreRoutes);

export default router;
