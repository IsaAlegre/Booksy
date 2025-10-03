import { Router } from "express";
import { ReviewController } from "./reviewsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

// crear reseña para un libro
router.post("/", authMiddleware, ReviewController.create);

// eliminar reseña
router.delete("/:reviewId", authMiddleware, ReviewController.remove);

// ver reseñas de un libro
router.get("/", ReviewController.getByBook);

export default router;
