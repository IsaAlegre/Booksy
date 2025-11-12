import { Router } from "express";
import { userController } from "./userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import libraryRoutes from "../libraries/libraryRoutes.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { upload } from "../../config/multer.js";

const router = Router();

// --- RUTAS PÚBLICAS (SIN PARÁMETROS) ---
router.get("/search", userController.handleSearchUsers.bind(userController));

// --- RUTAS PROTEGIDAS (SIN PARÁMETROS) ---
router.get("/", authMiddleware, adminMiddleware, userController.getAll.bind(userController));

router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  userController.updateProfile.bind(userController) 
);

// --- RUTAS CON PARÁMETROS (AL FINAL) ---

// Obtener perfil COMPLETO de un usuario (con biblioteca)
// GET /api/users/:id/public
router.get("/:id/public", userController.handleGetPublicProfile.bind(userController));

// Obtener perfil básico de un usuario (nombre, foto, descripción)
// GET /api/users/:id
router.get("/:id", userController.handleGetProfile.bind(userController));

// Eliminar usuario
router.delete(
  "/:id",
  authMiddleware,
  userController.delete.bind(userController)
);

// --- BIBLIOTECA (ANIDADA) ---
// GET /api/users/:userId/library
// POST /api/users/:userId/library
// PUT /api/users/:userId/library/:bookId
// DELETE /api/users/:userId/library/:bookId
router.use("/:userId/library", libraryRoutes);

export default router;