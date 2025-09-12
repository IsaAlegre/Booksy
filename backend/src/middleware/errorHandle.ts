// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error no controlado:", err); // Loguea el error real

  // Envía una respuesta genérica al cliente
  res.status(500).json({ message: "Internal server error" });
}