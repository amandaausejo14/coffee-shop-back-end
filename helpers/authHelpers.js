import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const { PEPPER_KEY, TOKEN_KEY } = process.env;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const mix = password + PEPPER_KEY;
  const hashedPass = await bcrypt.hash(mix, salt);
  return hashedPass;
};

export const createToken = (_id) => {
  const token = jwt.sign({ _id }, TOKEN_KEY, { expiresIn: "1d" });
  return token;
};

export const comparePassword = async (password, storedPassword) => {
  const mix = password + PEPPER_KEY;
  const isValidPass = await bcrypt.compare(mix, storedPassword);

  if (!isValidPass) {
    const error = new Error("The email or password entered is incorrect.");
    error.status = 401;
    throw error;
  }
};
