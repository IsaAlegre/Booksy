import { Router } from "express";
import { libraryController } from "./libraryController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { ownershipMiddleware } from "../../middleware/ownershipMiddleware.js";

// La opción { mergeParams: true } es crucial para poder acceder a :userId desde el enrutador padre.
const router = Router({ mergeParams: true });

// GET /api/users/:userId/library
router.get("/", libraryController.getUserLibrary.bind(libraryController));

// POST /api/users/:userId/library
router.post("/", authMiddleware, ownershipMiddleware, libraryController.addBook.bind(libraryController));

// PUT /api/users/:userId/library/:libraryId
router.put("/:libraryId", authMiddleware, ownershipMiddleware, libraryController.updateStatus.bind(libraryController));

// DELETE /api/users/:userId/library/:libraryId
router.delete("/:libraryId", authMiddleware, ownershipMiddleware, libraryController.removeBook.bind(libraryController));

export default router;