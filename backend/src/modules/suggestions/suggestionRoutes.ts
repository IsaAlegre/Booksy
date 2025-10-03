import { Router } from "express";
import SuggestionController from "./suggestionController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { adminMiddleware } from "../../middleware/adminMiddleware";

const router = Router();

// cualquier usuario autenticado o anónimo puede enviar
router.post("/", authMiddleware, SuggestionController.create);

// admin puede ver todas las sugerencias
router.get("/", authMiddleware, adminMiddleware, SuggestionController.list);

// admin marca como visto
router.patch("/:id/seen", authMiddleware, adminMiddleware, SuggestionController.markSeen);

export default router;