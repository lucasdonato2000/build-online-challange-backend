import express from "express";
import { NoteController } from "../controllers/NoteController";
import { NoteService } from "../services/NoteService";
import { NoteRepository } from "../repositories/NoteRepository";
import { authMiddleware } from "../middleware/authMiddleware";

const noteRepository = new NoteRepository();
const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

const router = express.Router();

router.use(authMiddleware);

router.get("/notes", noteController.getNotesHandler);
router.get("/notes/:noteId", noteController.getNoteHandler);
router.post("/contacts/:contactId/notes", noteController.createNoteHandler);
router.put("/notes/:noteId", noteController.updateNoteHandler);

export default router;
