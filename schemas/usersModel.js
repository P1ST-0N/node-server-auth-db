import { Schema, model } from "mongoose";
import userConst from "./usersConst.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: userConst.passwordMinLength,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: userConst.emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: userConst.subscriptionTypes,
      default: "starter",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

export default User;
