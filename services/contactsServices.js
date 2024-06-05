import Contact from "../schemas/contactsModel.js";
import { queryProjection } from "../schemas/contactsModel.js";

const count = (filter) => Contact.countDocuments(filter);

const list = (filter, pagination) =>
  Contact.find(filter)
    .select(queryProjection)
    .skip(pagination.skip)
    .limit(pagination.limit);

const getById = (contactId) =>
  Contact.findById(contactId).select(queryProjection);

const remove = (contactId) =>
  Contact.findByIdAndDelete(contactId).select(queryProjection);

const add = (contactData) => Contact.create(contactData);

const update = (contactId, contactData) =>
  Contact.findByIdAndUpdate(contactId, contactData, {
    new: true,
  }).select(queryProjection);

export default {
  count,
  list,
  getById,
  remove,
  add,
  update,
};
