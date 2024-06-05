import Joi from "joi";
import userConst from "./usersConst.js";

const create = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(userConst.emailRegExp)
    .required(),
  password: Joi.string().min(userConst.passwordMinLength).trim().required(),
  subscription: Joi.string().valid(...userConst.subscriptionTypes),
});

const updateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...userConst.subscriptionTypes)
    .required(),
});

const verifyEmail = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(userConst.emailRegExp)
    .required(),
});

export default {
  create,
  updateSubscription,
  verifyEmail,
};
