import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const { PEPPER_KEY, TOKEN_KEY } = process.env;
console.log(TOKEN_KEY, PEPPER_KEY);

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
