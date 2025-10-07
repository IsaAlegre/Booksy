import type { Request, Response, NextFunction } from "express";
import { userService } from "./userService.js";
import { UserRole } from "./userEntity.js";

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }


  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      // 1. Primero, verifica que el parámetro existe
      if (!idParam) {
        return res.status(400).json({ message: "User ID must be provided in the URL." });
      }

      // 2. Ahora, TypeScript sabe que idParam es un string
      const idToDelete = parseInt(idParam, 10);

      if (isNaN(idToDelete)) {
        return res.status(400).json({ message: "Invalid user ID format." });
      }

      const authenticatedUser = req.user; // Usuario que hace la petición (del token)

      // Regla de autorización:
      // Permite la acción si el usuario es admin O si está intentando borrar su propia cuenta.
      if (authenticatedUser?.role !== UserRole.ADMIN && authenticatedUser?.userId !== idToDelete) {
        return res.status(403).json({ message: "Forbidden: You can only delete your own account." });
      }

      await userService.delete(idToDelete);
      res.status(204).send();
    } catch (error) {
      next(error);
      
    }
  }

  async handleSearchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // La consulta de búsqueda vendrá como un query parameter, ej: /users/search?q=john
      const query = req.query.q as string;

      if (!query) {
        return res.status(400).json({ message: "Search query parameter 'q' is required." });
      }

      const users = await userService.searchByUsername(query);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // MODIFICADO: Renombramos getProfile a handleGetProfile para claridad
  async handleGetProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ message: "User ID must be provided in the URL." });
      }

      const userId = parseInt(idParam, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userProfile = await userService.findProfileById(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(userProfile);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();