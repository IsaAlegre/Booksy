import { Router } from "express";
import { userController } from "./userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import libraryRoutes from "../libraries/libraryRoutes";

const router = Router();
router.use(authMiddleware);

router.use("/:userId/library", libraryRoutes);
router.get("/", userController.getAll.bind(userController));
router.post("/", userController.create.bind(userController));
router.delete("/:id", authMiddleware, userController.delete.bind(userController));

export default router;