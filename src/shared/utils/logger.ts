// shared/utils/logger.util.ts
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogOptions {
  level?: LogLevel;
  context?: string; // e.g., "AuthController", "UserService"
}

export class Logger {
  private static logDir = join(__dirname, "../../../logs");
  private static logFile = join(Logger.logDir, "app.log");

  // Ensure log directory exists
  private static ensureLogDir() {
    if (!existsSync(Logger.logDir)) {
      mkdirSync(Logger.logDir, { recursive: true });
    }
  }

  // Format log message with timestamp and context
  private static formatMessage(
    message: string,
    level: LogLevel,
    context?: string
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : "";
    return `[${timestamp}] ${level} ${contextStr} ${message}`;
  }

  // Write log to console and file
  static log(message: string, options: LogOptions = {}) {
    const { level = LogLevel.INFO, context } = options;

    // Format the log message
    const formattedMessage = this.formatMessage(message, level, context);

    // Console logging
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }

    // File logging
    try {
      this.ensureLogDir();
      appendFileSync(this.logFile, `${formattedMessage}\n`, "utf8");
    } catch (error) {
      console.error(`Failed to write to log file: ${error}`);
    }
  }

  // Convenience methods for different log levels
  static info(message: string, context?: string) {
    this.log(message, { level: LogLevel.INFO, context });
  }

  static warn(message: string, context?: string) {
    this.log(message, { level: LogLevel.WARN, context });
  }

  static error(message: string, context?: string) {
    this.log(message, { level: LogLevel.ERROR, context });
  }
}
