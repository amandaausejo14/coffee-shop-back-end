import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/usersRoute.js";
import passport from "passport";
import cookieSession from "cookie-session";
import session from "express-session";
dotenv.config();
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
//impostazioni server
const app = express();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true,
  }),
);

app.use(express.json());
//app.use(cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 400 }));
app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
  }),
);
//passport
app.use(passport.initialize());
app.use(passport.session());

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
