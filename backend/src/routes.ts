// src/routes.ts
import { Router } from "express";
import bookRoutes from "./modules/books/bookRoutes.js";

const router = Router();

// Rutas de cada módulo
router.use("/books", bookRoutes);

export default router;
