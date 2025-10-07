import { Router } from "express";
import { libraryController } from "./libraryController.js";

// La opción { mergeParams: true } es crucial para poder acceder a :userId desde el enrutador padre.
const router = Router({ mergeParams: true });

// GET /api/users/:userId/library
router.get("/", libraryController.getUserLibrary.bind(libraryController));

// POST /api/users/:userId/library
router.post("/", libraryController.addBook.bind(libraryController));

// PUT /api/users/:userId/library/:bookId
router.put("/:bookId", libraryController.updateStatus.bind(libraryController));

// DELETE /api/users/:userId/library/:bookId
router.delete("/:bookId", libraryController.removeBook.bind(libraryController));

export default router;