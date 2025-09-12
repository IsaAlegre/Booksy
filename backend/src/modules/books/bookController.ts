// src/modules/books/bookController.ts
import type { Request, Response } from "express";
import { bookService } from "./bookService.js";

export class BookController {
  async getAll(req: Request, res: Response) {
    const books = await bookService.getAll();
    res.json(books);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const book = await bookService.getById(Number(id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  }

  async create(req: Request, res: Response) {
    const newBook = await bookService.create(req.body);
    res.status(201).json(newBook);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await bookService.update(Number(id), req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await bookService.delete(Number(id));
    res.status(204).send();
  }
}

export const bookController = new BookController();
