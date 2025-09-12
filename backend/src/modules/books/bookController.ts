// src/modules/books/bookController.ts
import type { Request, Response } from "express";
import { bookService } from "./bookService.js";

export class BookController {
  async getAll(req: Request, res: Response) {
    console.log("Intentando obtener todos los libros...");
    const books = await bookService.getAll();
    console.log("Libros obtenidos:", books);
    res.json(books);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const book = await bookService.getById(Number(id));
    if (!book) {
      console.log(`Libro con ID: ${id} no encontrado.`);
      return res.status(404).json({ message: "Book not found" });
    res.json(book);
  }
  console.log(`Libro encontrado (ID: ${id}):`, book); // <-- Aquí
    res.json(book);
  }

  async create(req: Request, res: Response) {
    console.log("Datos recibidos para crear un nuevo libro:", req.body);
    const newBook = await bookService.create(req.body);
    console.log("Libro creado exitosamente:", newBook);
    res.status(201).json(newBook);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await bookService.update(Number(id), req.body);
    console.log(`Libro con ID: ${id} actualizado:`, updated);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await bookService.delete(Number(id));
    console.log(`Libro con ID: ${id} eliminado.`);
    res.status(204).send();
  }
}

export const bookController = new BookController();
