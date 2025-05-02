import express, { Router } from "express";
import AuthRoutes from "./AuthRoutes";

const router: Router = express.Router();

router.use("/auth", AuthRoutes);

export default router;
