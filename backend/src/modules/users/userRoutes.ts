import { Router } from "express";
import { userController } from "./userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import libraryRoutes from "../libraries/libraryRoutes";
import { adminMiddleware } from "../../middleware/adminMiddleware";

const router = Router();

router.get("/search", userController.handleSearchUsers.bind(userController));

// GET /api/users/123 -> Ver perfil público
router.get("/:id", userController.handleGetProfile.bind(userController));

router.get("/", authMiddleware, adminMiddleware, userController.getAll.bind(userController));

router.use("/:userId/library", libraryRoutes);
router.delete("/:id", authMiddleware, userController.delete.bind(userController));

export default router;