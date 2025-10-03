// src/modules/books/book.routes.ts
import { Router } from "express";
import { bookController } from "./bookController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import reviewRoutes from "../reviews/reviewRoutes.js";

const router = Router();

router.get("/", bookController.getAll.bind(bookController));
router.get("/:id", bookController.getById.bind(bookController));
//rutas protegidas
router.post("/", authMiddleware, adminMiddleware, bookController.create.bind(bookController));
router.put("/:id",authMiddleware, adminMiddleware, bookController.update.bind(bookController));
router.delete("/:id", authMiddleware, adminMiddleware, bookController.delete.bind(bookController));
router.use("/:bookId/reviews", reviewRoutes);

export default router;
