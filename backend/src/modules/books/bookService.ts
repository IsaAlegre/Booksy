import { AppDataSource } from "../../config/data_source.js";
import { Book } from "./bookEntity.js";

export class BookService {
  private bookRepo = AppDataSource.getRepository(Book);

  async getAll() {
    return await this.bookRepo.find();
  }

  async getById(id: number) {
    return await this.bookRepo.findOneBy({ id });
  }

  search(query: string) {
    return this.bookRepo
      .createQueryBuilder("book")
      .where("book.title ILIKE :q OR book.author ILIKE :q OR book.genre ILIKE :q OR book.isbn ILIKE :q", { q: `%${query}%` })
      .getMany();
  }

  async create(data: Partial<Book>) {
    const book = this.bookRepo.create(data);
    return await this.bookRepo.save(book);
  }

  async update(id: number, data: Partial<Book>) {
    await this.bookRepo.update(id, data);
    return await this.getById(id);
  }

  async delete(id: number) {
    return await this.bookRepo.delete(id);
  }
}

export const bookService = new BookService();