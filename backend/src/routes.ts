// src/routes.ts
import { Router } from "express";
import bookRoutes from "./modules/books/bookRoutes";
import userRoutes from "./modules/users/userRoutes"; // 1. Importar rutas de usuario
import authRoutes from "./modules/auth/authRoutes"; // Importar rutas de autenticación


const router = Router();

// Rutas de cada módulo
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes); 

export default router;
