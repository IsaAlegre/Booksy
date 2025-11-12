import type { Request, Response, NextFunction } from "express";
import { bookService } from "./bookService.js";
import { UserRole } from "../users/userEntity.js";

export class BookController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Intentando obtener todos los libros...");
      const books = await bookService.getAll();
      res.json(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const book = await bookService.getById(id);
      if (!book) {
        console.log(`Libro con ID: ${id} no encontrado.`);
        return res.status(404).json({ message: "Book not found" });
      }

      console.log(`Libro encontrado (ID: ${id}):`, book);
      res.json(book);
    } catch (error) {
      console.error("Error al obtener libro:", error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("=== DEBUG CREATE ===");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      console.log("==================");

      // Validar que sea admin
      const userRole = (req as any).user?.role;
      if (userRole !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Only admins can create books" });
      }

    
      const title = String(req.body?.title || "").trim();
      const author = String(req.body?.author || "").trim();
      const description = String(req.body?.description || "").trim() || undefined;
      const genre = String(req.body?.genre || "").trim() || undefined;
      const yearStr = String(req.body?.year || "").trim();
      const pagesStr = String(req.body?.pages || "").trim();

      // Validar datos obligatorios
      if (!title || !author) {
        console.log(`Validación fallida. Title: "${title}", Author: "${author}"`);
        return res.status(400).json({ message: "Title and author are required" });
      }

      // Obtener URL de la imagen si se subió
      let coverUrl: string | undefined;
      if (req.file) {
        coverUrl = (req.file as any).path; // URL de Cloudinary
        console.log("Imagen subida a Cloudinary:", coverUrl);
      }

   
      const bookData = {
        title,
        author,
        ...(description && { description }),
        ...(genre && { genre }),
        ...(yearStr && { year: parseInt(yearStr, 10) }),
        ...(pagesStr && { pages: parseInt(pagesStr, 10) }),
        ...(coverUrl && { coverUrl }),
      };

      console.log("Datos a crear:", bookData);

      const newBook = await bookService.create(bookData);

      console.log("Libro creado exitosamente:", newBook);
      res.status(201).json({
        message: "Book created successfully",
        book: newBook,
      });
    } catch (error: any) {
      console.error("Error al crear libro:", error);
      if (error.message.includes("required") || error.message.includes("cannot exceed") || error.message.includes("must be")) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Validar que sea admin
      const userRole = (req as any).user?.role;
      if (userRole !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Only admins can update books" });
      }

      
      const title = req.body?.title ? String(req.body.title).trim() : undefined;
      const author = req.body?.author ? String(req.body.author).trim() : undefined;
      const description = req.body?.description !== undefined ? String(req.body.description).trim() || undefined : undefined;
      const genre = req.body?.genre ? String(req.body.genre).trim() : undefined;
      const yearStr = req.body?.year ? String(req.body.year).trim() : undefined;
      const pagesStr = req.body?.pages ? String(req.body.pages).trim() : undefined;

      // Obtener URL de la imagen si se subió
      let coverUrl: string | undefined;
      if (req.file) {
        coverUrl = (req.file as any).path; // URL de Cloudinary
        console.log("Nueva imagen subida a Cloudinary:", coverUrl);
      }

      // ✅ Filtrar undefined del objeto
      const updates: any = {
        ...(title && { title }),
        ...(author && { author }),
        ...(description !== undefined && { description }),
        ...(genre && { genre }),
        ...(yearStr && { year: parseInt(yearStr, 10) }),
        ...(pagesStr && { pages: parseInt(pagesStr, 10) }),
        ...(coverUrl && { coverUrl }),
      };

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const updated = await bookService.update(id, updates);

      console.log(`Libro con ID: ${id} actualizado:`, updated);
      res.json({
        message: "Book updated successfully",
        book: updated,
      });
    } catch (error: any) {
      console.error("Error al actualizar libro:", error);
      if (error.message === "Book not found") {
        return res.status(404).json({ message: "Book not found" });
      }
      if (error.message.includes("cannot exceed") || error.message.includes("must be")) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Validar que sea admin
      const userRole = (req as any).user?.role;
      if (userRole !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Only admins can delete books" });
      }

      await bookService.delete(id);
      console.log(`Libro con ID: ${id} eliminado.`);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error al eliminar libro:", error);
      if (error.message === "Book not found") {
        return res.status(404).json({ message: "Book not found" });
      }
      next(error);
    }
  }
}

export const bookController = new BookController();