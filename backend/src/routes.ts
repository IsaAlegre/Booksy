// src/routes.ts
import { Router } from "express";
import bookRoutes from "./modules/books/bookRoutes.js";
import userRoutes from "./modules/users/userRoutes.js"; // 1.
import authRoutes from "./modules/auth/authRoutes.js"; // 
import reviewRoutes from "./modules/reviews/reviewRoutes.js";
import suggestionRoutes from "./modules/suggestions/suggestionRoutes.js"; // 2.

const router = Router();

// Rutas de cada módulo
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes); 
router.use("/reviews", reviewRoutes); // Rutas de reseñas
router.use("/suggestions", suggestionRoutes); // Rutas de sugerencias

export default router;
