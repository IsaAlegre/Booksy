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

   async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId; // Obtén el ID del usuario del token JWT
      
      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { description } = req.body;
      let profilePictureUrl: string | undefined;

      // Si se subió una foto, obtén la URL desde Cloudinary
      if (req.file) {
        profilePictureUrl = (req.file as any).path; // URL de Cloudinary
      }

      // Actualiza el perfil del usuario
      const updatedUser = await userService.updateProfile(userId, {
        description: description || undefined,
        profilePicture: profilePictureUrl,
      });

      res.json({
        message: "Perfil actualizado exitosamente",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();