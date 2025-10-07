import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../modules/users/userEntity.js";

// 1. Definimos la estructura exacta de nuestro payload
interface CustomJwtPayload extends JwtPayload {
  userId: number;
  username: string;
  role: UserRole
}

// 2. Extendemos el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    return res.status(500).json({ message: "Internal Server Error: JWT configuration is missing." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    // verify devuelve JwtPayload | string | Jwt | void según sobrecargas; pasamos por unknown antes de la aserción
    const verified = jwt.verify(token, jwtSecret!);
    const payload = verified as unknown as CustomJwtPayload;

    // comprobaciones runtime adicionales
    if (!payload || typeof payload.userId !== "number") {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}