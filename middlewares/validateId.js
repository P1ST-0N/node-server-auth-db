import mongoose from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    next(HttpError(400, "Invalid ID"));
  }
  next();
};

export default isValidId;
