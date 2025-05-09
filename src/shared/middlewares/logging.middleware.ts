// shared/middlewares/logging.middleware.ts
import { Request, Response, NextFunction } from "express";
import { Logger, LogLevel } from "../utils/logger";

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const context = "HTTP";

  // Log the incoming request
  Logger.info(`${method} ${url} from ${ip}`, context);

  // Capture the response status and duration
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const message = `${method} ${url} - Status: ${status}, Duration: ${duration}ms`;

    // Determine log level based on status code
    if (status >= 500) {
      Logger.error(message, context);
    } else if (status >= 400) {
      Logger.warn(message, context);
    } else {
      Logger.info(message, context);
    }
  });

  // Log errors caught by error-handling middleware
  res.on("error", (err: Error) => {
    Logger.error(
      `${method} ${url} - Error: ${err.message}\n${err.stack}`,
      context
    );
  });

  next();
};
