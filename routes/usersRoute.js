import express from "express";
import User from "../models/userModel.js";
import { hashPassword, controlAuthorization } from "../helpers/authHelpers.js";
const router = express.Router();

//GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//GET single users
router.get("/:id", async (req, res) => {
  console.log(req);
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//update user
router.put("/:id", controlAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (req.user._id !== req.params.id) {
      return res.status(403).send("Unauthorized to update this user");
    }
    if (req.body.password && req.body.password !== user.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        street: req.body.street,
        house_number: req.body.house_number,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send(error.message || "Internal Server Error");
  }
});

router.delete("/:id", controlAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await User.findByIdAndDelete(user._id);
    return res.status(200).json({
      message: `The user ID${user._id} was erased from database`,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(404).json({ message: `User with ID:${id} not found` });
  }
});
export default router;
