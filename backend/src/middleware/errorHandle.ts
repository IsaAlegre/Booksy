// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundErrors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Error no controlado:", err);

  // Envía una respuesta genérica al cliente
  res.status(500).json({ message: "Internal server error" });
}