import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/usersRoute.js";
import passport from "passport";
import passportSetUp from "./passport.js";
dotenv.config();
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;
//impostazioni server
const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());
//passport
app.use(passport.initialize());
app.use(passport.session);

//Routes
app.use("/auth", authRoute);
app.use("/users", userRouter);

//connect server / database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongoDb");
    app.listen(PORT, () => {
      console.log("Server is running!");
    });
  })
  .catch((err) => console.log(err));
