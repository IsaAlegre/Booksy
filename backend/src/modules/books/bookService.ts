import { AppDataSource } from "../../config/data_source.js";
import { Book } from "./bookEntity.js";
import type { Repository } from "typeorm";

export class BookService {
  private get BookRepo(): Repository<Book>{
    return AppDataSource.getRepository(Book);
  }
  async getAll() {
    return await this.BookRepo.find();
  }

  async getById(id: number) {
    return await this.BookRepo.findOneBy({ id });
  }

  search(query: string) {
    return this.BookRepo
      .createQueryBuilder("book")
      .where("book.title ILIKE :q OR book.author ILIKE :q OR book.genre ILIKE :q OR book.isbn ILIKE :q", { q: `%${query}%` })
      .getMany();
  }

  async create(data: Partial<Book>) {
    const book = this.BookRepo.create(data);
    return await this.BookRepo.save(book);
  }

  async update(id: number, data: Partial<Book>) {
    await this.BookRepo.update(id, data);
    return await this.getById(id);
  }

  async delete(id: number) {
    return await this.BookRepo.delete(id);
  }
}

export const bookService = new BookService();