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

export const controlAuthorization = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send(`Token needed`);
  }
  if (token) {
    jwt.verify(token, TOKEN_KEY, (err, user) => {
      if (err) {
        return res.status(403).send(`Invalid token`);
      }
      req.user = user;
      next();
    });
  } else {
    console.error(error);
    return res.status(403).send(`Request not authorized`);
  }
};
