// src/routes.ts
import { Router } from "express";
import bookRoutes from "./modules/books/bookRoutes";
import userRoutes from "./modules/users/userRoutes"; // 1.
import authRoutes from "./modules/auth/authRoutes"; // 
import reviewRoutes from "./modules/reviews/reviewRoutes";
import suggestionRoutes from "./modules/suggestions/suggestionRoutes"; // 2.

const router = Router();

// Rutas de cada módulo
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes); 
router.use("/reviews", reviewRoutes); // Rutas de reseñas
router.use("/suggestions", suggestionRoutes); // Rutas de sugerencias

export default router;
