import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
dotenv.config();
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;
//impostazioni server
const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());
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

//Routes
app.use("/auth", authRoute);
