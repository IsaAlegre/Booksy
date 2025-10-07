// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundErrors.js";

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    // Ahora TypeScript sabe que err PUEDE tener un statusCode
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }

    res.status(statusCode).json({
        message: message,
    });
};