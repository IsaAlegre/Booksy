import { Router } from "express";
import { handleRegister, handleLogin, handleMe, handleForgotPassword, handleResetPassword } from "./authController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/me", authMiddleware, handleMe);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);
export default router;