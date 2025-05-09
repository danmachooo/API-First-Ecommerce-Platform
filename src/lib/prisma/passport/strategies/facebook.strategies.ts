import { Strategy as FacebookStrategy } from "passport-facebook";
import { UserService } from "../../../../services/prisma/user.service";
import passport from "passport";

// Validate env vars before strategy initialization
if (!process.env.FB_CLIENT_ID || !process.env.FB_CLIENT_SECRET) {
  throw new Error("Missing Facebook OAuth credentials in environment");
}

const service = new UserService();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID!,
      clientSecret: process.env.FB_CLIENT_SECRET!,
      callbackURL: "/api/oauth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);

      let user = await service.findUserByEmail(email);

      if (!user) {
        user = await service.createUser({
          email,
          firstname: profile.name?.givenName || "Facebook",
          lastname: profile.name?.familyName || "User",
          provider: "facebook",
          providerId: profile.id,
        });
      }

      return done(null, user);
    }
  )
);
