import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/usersRoute.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
import stripeRouter from "./routes/stripeRoute.js";
import passport from "passport";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { MONGODB_URI, CALL_BACK_URL, SESSION_SECRET } = process.env;
const PORT = process.env.PORT || 3000;
// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server settings
const app = express();
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://coffee-south.vercel.app"],
    credentials: true,
  }),
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "None",
      secure: false,
    },
  }),
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// to convert the images in static
app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));

// Passport
app.use(passport.initialize());
app.use(passport.session());
//route of stripe webhook, no need to parse json, requires raw body
app.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeRouter);

// Routes
app.use("/auth", authRoute);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/stripe", stripeRouter);
// Connect server / database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server is running!");
      console.log(PORT);
    });
  })
  .catch((err) => console.log(err));
