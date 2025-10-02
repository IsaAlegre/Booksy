// src/modules/books/book.routes.ts
import { Router } from "express";
import { bookController } from "./bookController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { adminMiddleware } from "../../middleware/adminMiddleware";
import reviewRoutes from "../reviews/reviewRoutes";

const router = Router();

router.get("/", bookController.getAll.bind(bookController));
router.get("/:id", bookController.getById.bind(bookController));
//rutas protegidas
router.post("/", authMiddleware, adminMiddleware, bookController.create.bind(bookController));
router.put("/:id",authMiddleware, adminMiddleware, bookController.update.bind(bookController));
router.delete("/:id", authMiddleware, adminMiddleware, bookController.delete.bind(bookController));
router.use("/:bookId/reviews", reviewRoutes);

export default router;
