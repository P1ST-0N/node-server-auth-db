import express from "express";
// import authCtrl
import userSchemas from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authControl from "../middlewares/authControl.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userSchemas.create, true)); //authCtrl.register

usersRouter.post("/login", validateBody(userSchemas.create, true)); //login

usersRouter.post("/logout", authControl); //logout

usersRouter.get("/current", authControl); //current

usersRouter.patch(
  "/",
  authControl,
  validateBody(userSchemas.updateSubscription)
  //updateSubscription
);

usersRouter.patch(
  "/avatars",
  authControl,
  uploadAvatar.single("avatar")
  //updateAvatar
);

usersRouter.get("/verify/:verificationToken"); //authCtrl.verifyEmail

usersRouter.post(
  "/verify",
  validateBody(userSchemas.verifyEmail, true)
  //sendVerificationEmail
);

export default usersRouter;
