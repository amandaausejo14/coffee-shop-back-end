import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/usersRoute.js";
import productRouter from "./routes/productRoutes.js";
import passport from "passport";
import session from "express-session";
dotenv.config();
const { MONGODB_URI, CALL_BACK_URL } = process.env;
const PORT = process.env.PORT || 3000;
//impostazioni server
const app = express();
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://coffee-shop-steel-zeta.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "None",
      secure: true,
    },
  }),
);
//passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", authRoute);
app.use("/users", userRouter);
app.use("/product", productRouter);

//connect server / database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongoDb");
    console.log(`${CALL_BACK_URL}/auth/google/callback`);
    app.listen(PORT, () => {
      console.log("Server is running!");
      console.log(PORT);
    });
  })
  .catch((err) => console.log(err));
