import express from "express";
import contactsCtrl from "../controllers/contactsControllers.js";
import contactsSchemas from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../middlewares/validateId.js";
// import authControl

const contactsRouter = express.Router();
//authControl
// contactsRouter.use();

contactsRouter.get("/", contactsCtrl.getAll);

contactsRouter.get("/:id", isValidId, contactsCtrl.getOne);

contactsRouter.delete("/:id", isValidId, contactsCtrl.remove);

contactsRouter.post(
  "/",
  validateBody(contactsSchemas.create, true),
  contactsCtrl.create
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(contactsSchemas.update, true),
  contactsCtrl.update
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(contactsSchemas.updateStatus),
  contactsCtrl.updateStatus
);

export default contactsRouter;
