import { AppDataSource } from "../../config/data_source.js";
import { Library, LibraryStatus } from "./libraryEntity.js";
import { User } from "../users/userEntity.js";
import { Book } from "../books/bookEntity.js";

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

    const existingEntry = await this.libraryRepo.findOne({ 
      where: { user: { id: userId }, book: { id: bookId } } 
    });
    if (existingEntry) {
      existingEntry.status = status;
      return this.libraryRepo.save(existingEntry);
    }

    const newEntry = this.libraryRepo.create({ user, book, status });
    return this.libraryRepo.save(newEntry);
  }

  async updateBookStatus(userId: number, libraryId: number, status: LibraryStatus): Promise<Library> {
    // ✅ Búsqueda directa sin relaciones anidadas
    const entry = await this.libraryRepo.findOne({
      where: { id: libraryId },
      relations: ["user", "book"],
    });
    
    if (!entry) {
      throw new Error("Library entry not found");
    }

    // ✅ Validar que el usuario sea el propietario
    if (entry.user.id !== userId) {
      throw new Error("Unauthorized: This book does not belong to your library");
    }

    entry.status = status;
    return this.libraryRepo.save(entry);
  }

  async removeBookFromLibrary(userId: number, libraryId: number): Promise<void> {
    // ✅ Búsqueda directa sin relaciones anidadas
    const entry = await this.libraryRepo.findOne({
      where: { id: libraryId },
      relations: ["user"],
    });
    
    if (!entry) {
      throw new Error("Library entry not found");
    }

    // ✅ Validar que el usuario sea el propietario
    if (entry.user.id !== userId) {
      throw new Error("Unauthorized: This book does not belong to your library");
    }

    await this.libraryRepo.remove(entry);
  }
}

export const libraryService = new LibraryService();