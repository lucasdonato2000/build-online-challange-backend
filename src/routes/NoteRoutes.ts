import express from "express";
import { NoteController } from "../controllers/NoteController";
import { NoteService } from "../services/NoteService";
import { NoteRepository } from "../repositories/NoteRepository";
import {
  authMiddleware,
  validateAddNote,
  validateContactParam,
  validateNoteParam,
  validateQuery,
} from "../middleware";

const noteRepository = new NoteRepository();
const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

const router = express.Router();

router.use(authMiddleware);

router.get("/notes", validateQuery, noteController.getNotesHandler);
router.get("/notes/:noteId", validateNoteParam, noteController.getNoteHandler);
router.post(
  "/contacts/:contactId/notes",
  validateAddNote,
  validateContactParam,
  noteController.addNoteHandler
);

export { router };
