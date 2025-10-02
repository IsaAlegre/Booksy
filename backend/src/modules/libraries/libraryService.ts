import { AppDataSource } from "../../config/data_source";
import { Library, LibraryStatus } from "./libraryEntity";
import { User } from "../users/userEntity";
import { Book } from "../books/bookEntity";

export class LibraryService {
  private libraryRepo = AppDataSource.getRepository(Library);
  private userRepo = AppDataSource.getRepository(User);
  private bookRepo = AppDataSource.getRepository(Book);

  async getUserLibrary(userId: number): Promise<Library[]> {
    return this.libraryRepo.find({
      where: { user: { id: userId } },
      relations: ["book"], // Carga la información del libro relacionado
    });
  }

  async addBookToLibrary(userId: number, bookId: number, status: LibraryStatus): Promise<Library> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new Error("Book not found");

    const existingEntry = await this.libraryRepo.findOne({ where: { user: { id: userId }, book: { id: bookId } } });
    if (existingEntry) {
      existingEntry.status = status;
      return this.libraryRepo.save(existingEntry);
    }

    const newEntry = this.libraryRepo.create({ user, book, status });
    return this.libraryRepo.save(newEntry);
  }

  async updateBookStatus(userId: number, bookId: number, status: LibraryStatus): Promise<Library> {
    const entry = await this.libraryRepo.findOne({ where: { user: { id: userId }, book: { id: bookId } } });
    if (!entry) throw new Error("Book not found in user's library");

    entry.status = status;
    return this.libraryRepo.save(entry);
  }

  async removeBookFromLibrary(userId: number, bookId: number): Promise<void> {
    const entry = await this.libraryRepo.findOne({ where: { user: { id: userId }, book: { id: bookId } } });
    if (!entry) throw new Error("Book not found in user's library");

    await this.libraryRepo.remove(entry);
  }
}

export const libraryService = new LibraryService();