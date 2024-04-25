import express from "express";
import User from "../models/userModel.js";
const router = express.Router();

//GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

export default router;
