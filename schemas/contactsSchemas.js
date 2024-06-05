import Joi from "joi";

const create = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
});

const update = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().trim(),
  phone: Joi.string().trim(),
});

const updateStatus = Joi.object({
  favorite: Joi.boolean().required(),
});

export default {
  create,
  update,
  updateStatus,
};
