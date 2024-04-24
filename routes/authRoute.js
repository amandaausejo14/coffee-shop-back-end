import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import { hashPassword, createToken } from "../helpers/authHelpers.js";
// //SIGN UP
router.post("/sign-up", async (req, res) => {
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

export default router;
