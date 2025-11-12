import { Router } from "express";
import { userController } from "./userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import libraryRoutes from "../libraries/libraryRoutes.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import {upload} from "../../config/multer.js";


const router = Router();

router.get("/search", userController.handleSearchUsers.bind(userController));

// Obtener perfil COMPLETO de un usuario (con biblioteca)
// GET /api/users/:id/public
router.get("/:id/public", userController.handleGetPublicProfile.bind(userController));

// Obtener perfil básico de un usuario (nombre, foto, descripción)
// GET /api/users/:id
router.get("/:id", userController.handleGetProfile.bind(userController));



// Rutas que requieren autenticación

router.get("/", authMiddleware, adminMiddleware, userController.getAll.bind(userController));

router.use("/:userId/library", libraryRoutes);
router.delete(
    "/:id",
    authMiddleware,
    userController.delete.bind(userController)
);

router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  userController.updateProfile
);

export default router;