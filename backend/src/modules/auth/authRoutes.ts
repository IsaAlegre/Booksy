import { Router } from "express";
import { handleRegister, handleLogin } from "./authController";

const router = Router();
router.post("/register", handleRegister);
router.post("/login", handleLogin);
export default router;