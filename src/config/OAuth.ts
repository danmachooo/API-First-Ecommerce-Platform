export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/oauth/google/callback",
};
export const facebookConfig = {
  clientID: process.env.FB_CLIENT_ID!,
  clientSecret: process.env.FB_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/oauth/facebook/callback",
  profileFields: ["id", "emails", "name"],
};
