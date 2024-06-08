import User from "../schemas/usersModel.js";

const get = (userData) => User.findOne(userData);

const add = (userData) => User.create(userData);

const update = (userData) => {
  const { id } = userData;
  const updData = { ...userData };
  delete updData.id;
  return User.findByIdAndUpdate(id, updData, { new: true });
};

export default {
  get,
  add,
  update,
};
