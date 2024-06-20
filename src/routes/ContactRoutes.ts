import express from "express";
import { ContactController } from "../controllers";
import {
  authMiddleware,
  uploadMiddleware,
  validateAddContact,
  validateContactParam,
  validateQuery,
  validateUpdateContact,
} from "../middleware";
import { ContactRepository } from "../repositories";
import { ContactService } from "../services";

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

const router = express.Router();

router.use(authMiddleware);

router.get("/contacts", validateQuery, contactController.getContactsHandler);
router.get(
  "/contacts/:contactId",
  validateContactParam,
  contactController.getContactHandler
);
router.post(
  "/contacts",
  uploadMiddleware.single("profilePicture"),
  validateAddContact,
  validateContactParam,
  contactController.addContactHandler
);
router.put(
  "/contacts/:contactId",
  uploadMiddleware.single("profilePicture"),
  validateContactParam,
  validateUpdateContact,
  contactController.updateContactHandler
);

export { router };
