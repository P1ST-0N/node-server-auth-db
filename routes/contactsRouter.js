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

contactsRouter.get("/:id"); //getOne

contactsRouter.delete("/:id"); //remove

contactsRouter.post("/"); //create

contactsRouter.put("/:id"); //update

contactsRouter.patch("/:id/favorite"); //updateStatus

export default contactsRouter;
