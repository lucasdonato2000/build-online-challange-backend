import express from "express";
import { ContactController } from "../controllers";
import {
  authMiddleware,
  uploadMiddleware,
  validateContact,
  validateUpdateContact,
} from "../middleware";

const contactController = new ContactController();

const router = express.Router();

router.use(authMiddleware);

router.get("/contacts", contactController.getContactsHandler);
router.get("/contacts/:contactId", contactController.getContactHandler);
router.post(
  "/contacts",
  uploadMiddleware.single("profilePicture"),
  validateContact,
  contactController.addContactHandler
);
router.put(
  "/contacts/:contactId",
  uploadMiddleware.single("profilePicture"),
  validateUpdateContact,
  contactController.updateContactHandler
);

export { router };
