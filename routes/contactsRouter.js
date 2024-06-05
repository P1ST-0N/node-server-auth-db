import express from "express";
// import  controllers
// import contactsSchema
// import validateBody
// import isValid
// import authControl

const contactsRouter = express.Router();

contactsRouter.use(); //authControl

contactsRouter.get("/"); //getAll

contactsRouter.get("/:id"); //getOne

contactsRouter.delete("/:id"); //remove

contactsRouter.post("/"); //create

contactsRouter.put("/:id"); //update

contactsRouter.patch("/:id/favorite"); //updateStatus

export default contactsRouter;
