import passport from "passport";
import "./facebook.strategies";
import "./google.strategies";
import { UserService } from "../../../../services/prisma/user.service";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = UserService.findUserById(id);
  done(user, null);
});
