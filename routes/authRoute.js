import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import { hashPassword, createToken } from "../helpers/authHelpers.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALL_BACK_URL, CLIENT_URL, PASSWORD } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${CALL_BACK_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`user profile` + JSON.stringify(profile));
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          user_name: profile.displayName,
          email: profile.emails[0].value,
          password: `${PASSWORD}`,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// //SIGN UP
router.post("/signup", async (req, res) => {
  console.log(req);
  try {
    const { email, password, user_name } = req.body;
    console.log(email, password, user_name);
    //make sure everything is passed
    if (!email || !password || !user_name) {
      return res.status(400).json("You must insert email, password, and username");
    }
    //create a new user
    const newUser = new User({
      user_name: user_name,
      email: email,
      password: await hashPassword(password),
    });

    //create token
    const token = createToken(newUser._id);

    const { _id } = await User.create(newUser);
    const user = await User.findById(_id);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json(error.message || error);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
//GOOGLE

router.get("/login/success", (req, res) => {
  console.log("sono qui adesso");
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${CLIENT_URL}`);
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}`,
    failureRedirect: "/login/failed",
  }),
);


///////////////////////////////////////////////////////////
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("You must insert email or password");
    }
    //control that the email exist in the database, compare password
    const user = await User.logInControl(email, password);
    //create token
    const token = createToken(user._id);
    return res.status(202).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json(error.message || error);
  }
});

export default router;
