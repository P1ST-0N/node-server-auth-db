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

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const updateSubscription = async (req, res, next) => {
  const { email, subscription } = await usersService.update({
    id: req.user._id,
    subscription: req.body.subscription,
  });

  const resBody = { user: { email, subscription } };

  res.json(resBody);
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) throw HttpError(400, "File not found!");

  const fileName = req.file.path;
  const { _id: id } = req.user;
  const newName = `${id}-${crypto.randomUUID()}${path.extname(fileName)}`;

  const image = await Jimp.read(fileName);
  image.resize(250, 250);

  await image.writeAsync(path.resolve("public/avatars", newName));
  await fs.unlink(fileName);

  const { avatarURL } = await usersService.update({
    id,
    avatarURL: `/avatars/${newName}`,
  });

  res.json({ avatarURL });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  if (!verificationToken) throw HttpError(400);

  const user = await usersService.get({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  await usersService.update({
    id: user._id,
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

const sendVerificationEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await usersService.get({ email });

  if (!user) throw HttpError(400, "Email is not registered");
  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const result = await mailService.sendEmail(
    mailService.registerTemplate({
      email,
      verificationToken: user.verificationToken,
    })
  );

  if (!result)
    throw HttpError(500, "Something went wrong. Please, try again later");

  res.json({ message: "Verification email sent" });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  sendVerificationEmail: ctrlWrapper(sendVerificationEmail),
};
