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
import mailService from "../services/mail.js";

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

  await mailService.sendEmail(
    mailService.registerTemplate({ email, verificationToken })
  );

  res.status(201).json({ user: { email, subscription } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const errorMessage = "Email or password is wrong";

  const user = await usersService.get({ email });

  if (!user) throw HttpError(401, errorMessage);

  if (!user.verify) throw HttpError(401, "Email is not verified");

  const isCorrectPass = await bcrypt.compare(password, user.password);

  if (!isCorrectPass) throw HttpError(401, errorMessage);

  const token = jwt.sign({ id: user._id }, process.env.DB_SECRET, {
    expiresIn: "23h",
  });

  await usersService.update({ id: user._id, token });

  const resBody = {
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  };

  res.json(resBody);
};

const logout = async (req, res, next) => {
  const user = await usersService.get({ _id: req.user._id });

  if (!user) throw HttpError(401);

  await usersService.update({ id: user._id, token: null });

  res.status(204).end();
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
