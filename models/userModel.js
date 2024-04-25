import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { comparePassword } from "../helpers/authHelpers.js";

const { Schema, model } = mongoose;

const validPassword = {
  minLength: 8,
  minLowerCase: 1,
  minUpperCase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "EMAIL is invalid"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
      validate: {
        validator: function (value) {
          // Custom password validation
          return (
            value.length >= validPassword.minLength &&
            value.match(/[a-z]/g)?.length >= validPassword.minLowerCase &&
            value.match(/[A-Z]/g)?.length >= validPassword.minUpperCase &&
            value.match(/[0-9]/g)?.length >= validPassword.minNumbers &&
            value.match(/[^a-zA-Z0-9]/g)?.length >= validPassword.minSymbols
          );
        },
        message:
          "Password must have at least:  8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      },
    },
  },
  { timestamps: true },
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.statics.logInControl = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (!user) {
    const error = new Error("The email or password entered is incorrect.");
    error.status = 400;
    throw error;
  }

  await comparePassword(password, user.password);

  return user;
};

const User = model("User", UserSchema);
export default User;
