import HttpError from "../helpers/HttpError";
import jwt from "jsonwebtoken";
import usersService from "../services/authServices.js";
import { userFilter } from "../controllers/contactsControllers";

const authControl = async (req, _, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  // divide try..catch block on 2 for error handling
  let decodeToken;
  try {
    if (bearer !== "Bearer") {
      throw new Error();
    }

    decodeToken = jwt.verify(token, process.env.DB_SECRET);
  } catch (error) {
    next(HttpError(401));
    return;
  }

  try {
    const user = await usersService.get({ _id: decodeToken.id });

    if (!user || !user.token || user.token !== token) {
      throw HttpError(401);
    }

    req.user = user;
    userFilter.id = user._id;
    next();
  } catch (error) {
    if (!error.status) error.message = "";
    next(error);
  }
};

export default authControl;
