import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserService } from "../../services/prisma/user.service";
import passport from "passport";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in environment");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/oauth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);

      try {
        let user = await UserService.findUserByEmail(email);

        if (!user) {
          user = await UserService.createUser({
            email,
            firstname: profile.name?.givenName || "Google",
            lastname: profile.name?.familyName || "User",
            provider: "google",
            providerId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);
