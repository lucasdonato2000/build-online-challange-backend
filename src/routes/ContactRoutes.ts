import express from "express";
import { ContactController } from "../controllers/ContactController";
import { authMiddleware } from "../middleware/authMiddleware";

const contactController = new ContactController();

const router = express.Router();

router.use(authMiddleware);

router.get("/contacts", contactController.getContactsHandler);
router.get("/contacts/:contactId", contactController.getContactHandler);
router.post("/contacts", contactController.addContactHandler);
router.put("/contacts/:contactId", contactController.updateContactHandler);

export default router;
