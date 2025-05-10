import { Role } from "../generated/prisma";

export class ConfigService {
  static getDefaultRole(): Role {
    return (process.env.DEFAULT_USER_ROLE || "CUSTOMER") as Role;
  }
  static enforceSingleSession(): boolean {
    return process.env.ENFORCE_SINGLE_SESSION === "true";
  }

  static getJwtExpiration(): string {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  static getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  static getGoogleConfig() {
    return {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/oauth/google/callback",
    };
  }

  static getFacebookConfig() {
    return {
      clientID: process.env.FB_CLIENT_ID!,
      clientSecret: process.env.FB_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/oauth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    };
  }
}
