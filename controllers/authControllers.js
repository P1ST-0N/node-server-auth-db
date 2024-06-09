import usersService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import Jimp from "jimp";
import crypto from "node:crypto";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
// import mailService

const register = async (req, res, next) => {
  const { email, password } = req.body;

  const existedUser = await usersService.get({ email });

  if (existedUser) throw HttpError(409, "Email in use");

  const hashPass = await bcrypt.hash(password, 12);
  const avatarURL = await gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const { subscription } = await usersService.add({
    email,
    password: hashPass,
    avatarURL,
    verificationToken,
  });

  //   await mailService.sendEmail
};
