import type { Request, Response, NextFunction } from "express";
import { libraryService } from "./libraryService.js";
import { LibraryStatus } from "./libraryEntity.js";

export class LibraryController {
  // solo pueda modificar su propia biblioteca. No necesita cambios.
  authorize(req: Request, res: Response, next: NextFunction) {
    const authenticatedUserId = req.user?.userId;
    const userIdParam = req.params.userId;
    if (!userIdParam) {
      return res.status(400).json({ message: "User ID parameter is required" });
    }
    const targetUserId = parseInt(userIdParam, 10);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!authenticatedUserId || authenticatedUserId !== targetUserId) {
      return res.status(403).json({ message: "Forbidden: You can only access your own library." });
    }
    next();
  }

  async getUserLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      // El middleware 'authorize' ya validó que el ID es correcto y pertenece al usuario.
      // Podemos usarlo con confianza.
      const userId = parseInt(req.params.userId!, 10);
      const library = await libraryService.getUserLibrary(userId);
      res.json(library);
    } catch (error) {
      next(error);
    }
  }

  //Usa el userId de la URL y valida el 'status'.
  async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId!, 10);
      const { bookId, status } = req.body;

      // Validación robusta del 'status'
      if (!bookId || !status || !Object.values(LibraryStatus).includes(status)) {
        return res.status(400).json({ 
          message: `Invalid request body. 'bookId' is required and 'status' must be one of: ${Object.values(LibraryStatus).join(', ')}` 
        });
      }

      const newEntry = await libraryService.addBookToLibrary(userId, bookId, status);
      res.status(201).json(newEntry);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene bookId de forma segura y valida el 'status'.
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId!, 10);
      const bookIdParam = req.params.bookId;
      const { status } = req.body;

      if (!bookIdParam) {
        return res.status(400).json({ message: "Book ID parameter is required" });
      }
      const bookId = parseInt(bookIdParam, 10);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid Book ID format" });
      }

      if (!status || !Object.values(LibraryStatus).includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${Object.values(LibraryStatus).join(', ')}` 
        });
      }

      const updatedEntry = await libraryService.updateBookStatus(userId, bookId, status);
      res.json(updatedEntry);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene bookId de forma segura y devuelve la respuesta correcta.
  async removeBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId!, 10);
      const bookIdParam = req.params.bookId;

      if (!bookIdParam) {
        return res.status(400).json({ message: "Book ID parameter is required" });
      }
      const bookId = parseInt(bookIdParam, 10);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid Book ID format" });
      }

      await libraryService.removeBookFromLibrary(userId, bookId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const libraryController = new LibraryController();