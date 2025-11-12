import type { Request, Response, NextFunction } from "express";
import { libraryService } from "./libraryService.js";
import { LibraryStatus } from "./libraryEntity.js";

export class LibraryController {

  async getUserLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const userIdParam = req.params.userId;
      
      if (!userIdParam) {
        return res.status(400).json({ message: "User ID parameter is required" });
      }

      const userId = parseInt(userIdParam, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
      }

      console.log("Obteniendo biblioteca del usuario:", userId);
      const library = await libraryService.getUserLibrary(userId);
      res.json(library);
    } catch (error) {
      console.error("Error en getUserLibrary:", error);
      next(error);
    }
  }

  
  async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("=== DEBUG addBook ===");
      console.log("params:", req.params);
      console.log("body:", req.body);
      console.log("user:", (req as any).user);

      const userIdParam = req.params.userId;
      
      if (!userIdParam) {
        return res.status(400).json({ message: "User ID parameter is required" });
      }

      const userId = parseInt(userIdParam, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
      }

      const { bookId, status } = req.body;

      if (!bookId) {
        return res.status(400).json({ message: "bookId is required" });
      }

      if (!status || !Object.values(LibraryStatus).includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${Object.values(LibraryStatus).join(', ')}` 
        });
      }

      console.log(`Agregando libro ${bookId} a biblioteca del usuario ${userId}`);
      const newEntry = await libraryService.addBookToLibrary(userId, bookId, status);
      res.status(201).json(newEntry);
    } catch (error: any) {
      console.error("Error en addBook:", error);
      next(error);
    }
  }

 
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userIdParam = req.params.userId;
      const bookIdParam = req.params.bookId;
      const { status } = req.body;

      if (!userIdParam || !bookIdParam) {
        return res.status(400).json({ message: "User ID and Book ID parameters are required" });
      }

      const userId = parseInt(userIdParam, 10);
      const bookId = parseInt(bookIdParam, 10);

      if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      if (!status || !Object.values(LibraryStatus).includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${Object.values(LibraryStatus).join(', ')}` 
        });
      }

      const updatedEntry = await libraryService.updateBookStatus(userId, bookId, status);
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error en updateStatus:", error);
      next(error);
    }
  }

  
  async removeBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userIdParam = req.params.userId;
      const bookIdParam = req.params.bookId;

      if (!userIdParam || !bookIdParam) {
        return res.status(400).json({ message: "User ID and Book ID parameters are required" });
      }

      const userId = parseInt(userIdParam, 10);
      const bookId = parseInt(bookIdParam, 10);

      if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      await libraryService.removeBookFromLibrary(userId, bookId);
      res.status(204).send();
    } catch (error) {
      console.error("Error en removeBook:", error);
      next(error);
    }
  }
}

export const libraryController = new LibraryController();