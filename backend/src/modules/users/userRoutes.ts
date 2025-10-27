import { Router } from "express";
import { userController } from "./userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import libraryRoutes from "../libraries/libraryRoutes.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import upload from "../../config/multer.js";


const router = Router();

router.get("/search", userController.handleSearchUsers.bind(userController));

// GET /api/users/123 -> Ver perfil público
router.get("/:id", userController.handleGetProfile.bind(userController));

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