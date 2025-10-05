import { Router } from "express";
import { handleRegister, handleLogin, handleMe } from "./authController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/me", authMiddleware, handleMe);
export default router;