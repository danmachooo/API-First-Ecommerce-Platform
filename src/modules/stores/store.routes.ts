// auth.router.ts
import express from "express";
import { StoreController } from "./store.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validation.middleware";
import { createStore } from "./store.schema";
import _store from "../../lib/prisma/store.lib";

const router = express.Router();
const store = new StoreController(_store);

router.post("/", validateRequest(createStore), store.create.bind(store));

export default router;
