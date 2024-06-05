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

export default {
  getAll: ctrlWrapper(getAll),
};
