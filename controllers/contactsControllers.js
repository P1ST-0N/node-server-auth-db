import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import converter from "../helpers/converter.js";
import { filters } from "../schemas/contactsModel.js";

export const userFilter = { id: null };

const getAll = async (req, res, next) => {
  const pageDefault = 1;
  const limitDefault = 10;

  let { page = pageDefault, limit = limitDefault } = req.query;

  page = Number(page) || pageDefault;
  limit = Number(limit) || limitDefault;

  const pagination = {
    skip: (page - 1) * limit,
    limit,
  };

  const filter = {};
  filters.split(",").forEach((field) => {
    let queryField = req.query[field];

    if (field === "favorite") queryField = converter.stringToBool(queryField);

    if (queryField !== undefined) {
      filter[field] = queryField;
    }
  });
  //test

  const total = await contactsService.count(filter);

  const contacts = await contactsService.list(filter, pagination);

  const reqBody = {
    totalContacts: total,
    page,
    limit,
    contacts,
  };

  res.json(reqBody);
};

const getOne = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getById(id);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.remove(id);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const create = async (req, res, next) => {
  const contact = await contactsService.add({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json(contact);
};

const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "Body must have at least one field");

  const { id } = req.params;
  const contact = await contactsService.update(id, req.body);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.update(id, req.body);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

export default {
  getAll: ctrlWrapper(getAll),
  getOne: ctrlWrapper(getOne),
  remove: ctrlWrapper(remove),
  create: ctrlWrapper(create),
  update: ctrlWrapper(update),
  updateStatus: ctrlWrapper(updateStatus),
};
