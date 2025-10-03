import { Router } from "express";
import SuggestionController from "./suggestionController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";

const router = Router();

// cualquier usuario autenticado o anónimo puede enviar
router.post("/", authMiddleware, SuggestionController.create);

// admin puede ver todas las sugerencias
router.get("/", authMiddleware, adminMiddleware, SuggestionController.list);

// admin marca como visto
router.patch("/:id/seen", authMiddleware, adminMiddleware, SuggestionController.markSeen);

export default router;