import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import { hashPassword, createToken } from "../helpers/authHelpers.js";
import passport from "passport";
// //SIGN UP
router.post("/signup", async (req, res) => {
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

//google auth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "/login/failed",
  }),
);
//failure or success
router.get("login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Success",
      user: req.user,
      token: token,
    });
  }
});

router.get("login/failed", (req, res) => {
  if (req.user) {
  }
  res.status(401).json({
    success: false,
    message: "Failed to log in",
  });
});
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
