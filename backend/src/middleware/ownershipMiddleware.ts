import type { Request, Response, NextFunction } from "express";

/**
 * Middleware que verifica que el usuario autenticado es el propietario de la biblioteca.
 * Valida que el :userId de la ruta coincida con el userId del token JWT.
 * 
 * Uso: Se aplica después del authMiddleware
 * Ejemplo: router.post("/", authMiddleware, ownershipMiddleware, controller.addBook)
 */
export function ownershipMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const idParam = req.params.userId;
      if (!idParam) {
        return res.status(400).json({ message: "El id de usuario debe ser proporcionado en la URL." });
      }
    // 1. Obtener el userId de la ruta (/users/:userId/library)
    const userIdFromUrl = parseInt(idParam, 10);

    // 2. Obtener el userId del token JWT (ya fue validado por authMiddleware)
    const authenticatedUserId = req.user?.userId;

    // 3. Validaciones
    if (isNaN(userIdFromUrl)) {
      return res.status(400).json({ message: "ID invalido en la URL" });
    }

    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // 4. Verificar que el usuario autenticado sea el propietario
    if (authenticatedUserId !== userIdFromUrl) {
      return res.status(403).json({
        message: "Prohibido: No tienes permiso para acceder a esta biblioteca",
      });
    }

    // 5. Si todo es válido, continuar
    next();
  } catch (error) {
    console.error("Ownership middleware error:", error);
    res.status(500).json({ message: "Error validating ownership" });
  }
}