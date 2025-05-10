// modules/auth/session.strategy.ts
import { IUser } from "../../services/interfaces/IUser";
import { generateToken } from "./jwt.util";
import { ISessionManagement } from "./auth.types";
import { ConflictError } from "../../shared/utils/error.util";
import { ConfigService } from "../../config/config.service";
import redisClient from "../../lib/prisma/redis.lib";
import { SignOptions } from "jsonwebtoken";

/**
 * Interface for session management strategies.
 */
export interface ISessionStrategy {
  /**
   * Creates a new session for the user.
   * @param user The user for whom to create a session.
   * @returns A session token.
   * @throws ConflictError if a session already exists (optional).
   */
  createSession(user: IUser): Promise<string>;

  /**
   * Destroys a session for the user.
   * @param userId The ID of the user whose session to destroy.
   * @throws Error if the operation is unsupported.
   */
  destroySession(userId: string, token?: string): Promise<void>;
}

/**
 * JWT-based session strategy for stateless session management.
 */
export class JwtSessionStrategy implements ISessionStrategy {
  redisClient: any;
  constructor(
    private sessionManagement: ISessionManagement,
    private configService: ConfigService
  ) {}

  async createSession(user: IUser): Promise<string> {
    // Optional: Enforce single-session policy based on configuration
    if (ConfigService.enforceSingleSession()) {
      const isLoggedIn = await this.sessionManagement.isLoggedIn(user.email);
      if (isLoggedIn) {
        throw new ConflictError(
          "A session already exists. Please log out first."
        );
      }
    }

    // Generate JWT with configurable expiration
    const token = generateToken(
      { userId: user.id, role: user.role },
      {
        expiresIn: ConfigService.getJwtExpiration() as SignOptions["expiresIn"],
      }
    );

    return token;
  }

  async destroySession(userId: string, token?: string): Promise<void> {
    // JWTs are stateless; no server-side cleanup needed
    if (token) {
      // Blacklist the specific token in Redis
      await this.redisClient.set(`blacklist:${token}`, "true", "EX", 86400);
    }
    return;
  }
}
