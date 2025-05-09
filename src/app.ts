import express, { Application, Request, Response, NextFunction } from "express";
import { errorHandlerMiddleware } from "./shared/middlewares/error.middleware";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/index";
import passport from "passport";
import "./lib/prisma/passport/strategies"; // wherever your passport strategies live
import cookieParser from "cookie-parser";
import { loggingMiddleware } from "./shared/middlewares/logging.middleware";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(loggingMiddleware);
app.use("/api", apiRouter);

app.use(errorHandlerMiddleware);

export default app;
