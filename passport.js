import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
import User from "./models/userModel.js";
import passport from "passport";

const configureGoogleStrategy = () => {
  return new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // If the user doesn't exist, create a new one
          user = await User.create({
            googleId: profile.id,
            user_name: profile.displayName,
            // Add any other necessary fields
          });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    },
  );
};
// Configure Google OAuth strategy
passport.use(configureGoogleStrategy());

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});
