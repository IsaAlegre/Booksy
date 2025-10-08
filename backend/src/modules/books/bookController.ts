import type { Request, Response, NextFunction } from "express";
import { bookService } from "./bookService.js";

export class BookController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Intentando obtener todos los libros...");
      const books = await bookService.getAll();
      const backendUrl = (process.env.BACKEND_URL?.replace(/\/$/, '')) ?? `${req.protocol}://${req.get('host')}`;

      // Mapea coverUrl relativo -> absoluto
      const mapped = books.map(b => ({
        ...b,
        coverUrl: b.coverUrl
          ? (b.coverUrl.startsWith('http') ? b.coverUrl : `${backendUrl}${b.coverUrl}`)
          : null
      }));

      res.json(mapped);
    } catch (error) {
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
      const backendUrl = (process.env.BACKEND_URL?.replace(/\/$/, '')) ?? `${req.protocol}://${req.get('host')}`;
      const fullCover = book.coverUrl
        ? (book.coverUrl.startsWith('http') ? book.coverUrl : `${backendUrl}${book.coverUrl}`)
        : null;

      res.json({ ...book, coverUrl: fullCover });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Datos recibidos para crear un nuevo libro:", req.body);
      const newBook = await bookService.create(req.body);
      const backendUrl = (process.env.BACKEND_URL?.replace(/\/$/, '')) ?? `${req.protocol}://${req.get('host')}`;
      const fullCover = newBook.coverUrl
        ? (newBook.coverUrl.startsWith('http') ? newBook.coverUrl : `${backendUrl}${newBook.coverUrl}`)
        : null;

      res.status(201).json({ ...newBook, coverUrl: fullCover });
      console.log("Libro creado exitosamente:", newBook);
    } catch (error) {
      next(error);
    }
  }

async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const updated = await bookService.update(id, req.body);
      console.log(`Libro con ID: ${id} actualizado:`, updated);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      await bookService.delete(id);
      console.log(`Libro con ID: ${id} eliminado.`);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const bookController = new BookController();