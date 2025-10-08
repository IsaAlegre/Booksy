import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../modules/users/userEntity.js";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const userRole = req.user?.role;

  if (userRole !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Forbidden: Access denied. Admin role required." });
  }
  next();
}