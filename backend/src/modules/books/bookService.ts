import { AppDataSource } from "../../config/data_source.js";
import { Book } from "./bookEntity.js";
import type { Repository } from "typeorm";

interface CreateBookInput {
  title: string;
  author: string;
  description?: string | undefined;
  genre?: string | undefined;
  year?: number | undefined;
  pages?: number | undefined;
  coverUrl?: string | undefined;
}

interface UpdateBookInput {
  title?: string | undefined;
  author?: string | undefined;
  description?: string | undefined;
  genre?: string | undefined;
  year?: number | undefined;
  pages?: number | undefined;
  coverUrl?: string | undefined;
}

export class BookService {
  private get bookRepo(): Repository<Book> {
    return AppDataSource.getRepository(Book);
  }

  async create(bookData: CreateBookInput): Promise<Book> {
    // Validaciones
    if (!bookData.title?.trim() || !bookData.author?.trim()) {
      throw new Error("Title and author are required");
    }

    if (bookData.title.length > 255) {
      throw new Error("Title cannot exceed 255 characters");
    }

    if (bookData.author.length > 255) {
      throw new Error("Author cannot exceed 255 characters");
    }

    if (bookData.description && bookData.description.length > 2000) {
      throw new Error("Description cannot exceed 2000 characters");
    }

    if (bookData.year && (bookData.year < 1000 || bookData.year > new Date().getFullYear())) {
      throw new Error(`Year must be between 1000 and ${new Date().getFullYear()}`);
    }

    if (bookData.pages && bookData.pages < 1) {
      throw new Error("Pages must be a positive number");
    }

    // Crear la instancia correctamente
    const book = new Book();
    book.title = bookData.title.trim();
    book.author = bookData.author.trim();
    book.description = bookData.description?.trim() || null;
    book.genre = bookData.genre?.trim() || null;
    book.year = bookData.year || null;
    book.pages = bookData.pages || null;
    book.coverUrl = bookData.coverUrl || null;

    return this.bookRepo.save(book);
  }

  async update(bookId: number, updates: UpdateBookInput): Promise<Book> {
    const book = await this.bookRepo.findOneBy({ id: bookId });

    if (!book) {
      throw new Error("Book not found");
    }

    if (updates.title) {
      if (updates.title.length > 255) {
        throw new Error("Title cannot exceed 255 characters");
      }
      book.title = updates.title.trim();
    }

    if (updates.author) {
      if (updates.author.length > 255) {
        throw new Error("Author cannot exceed 255 characters");
      }
      book.author = updates.author.trim();
    }

    if (updates.description !== undefined) {
      if (updates.description && updates.description.length > 2000) {
        throw new Error("Description cannot exceed 2000 characters");
      }
      book.description = updates.description?.trim() || null;
    }

    if (updates.genre !== undefined) {
      book.genre = updates.genre?.trim() || null;
    }

    if (updates.year !== undefined) {
      if (updates.year && (updates.year < 1000 || updates.year > new Date().getFullYear())) {
        throw new Error(`Year must be between 1000 and ${new Date().getFullYear()}`);
      }
      book.year = updates.year || null;
    }

    if (updates.pages !== undefined) {
      if (updates.pages && updates.pages < 1) {
        throw new Error("Pages must be a positive number");
      }
      book.pages = updates.pages || null;
    }

    if (updates.coverUrl !== undefined) {
      book.coverUrl = updates.coverUrl || null;
    }

    return this.bookRepo.save(book);
  }

  async getAll(): Promise<Book[]> {
    return this.bookRepo.find();
  }

  async getById(id: number): Promise<Book | null> {
    return this.bookRepo.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) {
      throw new Error("Book not found");
    }
    await this.bookRepo.remove(book);
  }
}

export const bookService = new BookService();