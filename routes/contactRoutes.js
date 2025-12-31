import expres from "express";
import {
  submitContactForm,
  getAllContacts,
} from "../controllers/contactController.js";

const contactRouter = expres.Router();

contactRouter.post("/", submitContactForm);
contactRouter.get("/", getAllContacts);

export default contactRouter;