// src/modules/books/bookController.ts
import type { Request, Response, NextFunction } from "express";
import { bookService } from "./bookService.js";

export class BookController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Intentando obtener todos los libros...");
      const books = await bookService.getAll();
      console.log("Libros obtenidos:", books.length);
      res.json(books);
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
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Datos recibidos para crear un nuevo libro:", req.body);
      const newBook = await bookService.create(req.body);
      console.log("Libro creado exitosamente:", newBook);
      res.status(201).json(newBook);
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