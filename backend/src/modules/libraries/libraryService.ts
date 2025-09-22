import { AppDataSource } from "../../config/data_source";
import { Library, LibraryStatus } from "./libraryEntity";
import { NotFoundError } from "../../errors/NotFoundErrors";
import { User } from "../users/userEntity";
import type { Repository } from "typeorm";

export class LibraryService {
  private get libraryRepo(): Repository<Library> {
    return AppDataSource.getRepository(Library);
  }

  private get userRepo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  /**
   * Obtiene todos los libros de la biblioteca de un usuario específico.
   */
  async getUserLibrary(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const libraryEntries = await this.libraryRepo.find({
      where: { user: { id: userId } },
      relations: ["book"], // Carga la información completa del libro asociado
    });

    return{
        userId: user.id,
        username: user.username,
        library: libraryEntries
    }
  }

  /**
   * Agrega un libro a la biblioteca de un usuario o actualiza su estado si ya existe.
   */
  async addBookToLibrary(userId: number, bookId: number, status: LibraryStatus) {
    const existingEntry = await this.libraryRepo.findOne({
        where: { user: { id: userId }, book: { id: bookId } }
    });

    if (existingEntry) {
        // Si el libro ya está en la biblioteca, actualiza su estado
        existingEntry.status = status;
        return await this.libraryRepo.save(existingEntry);
    }

    // Si no existe, crea una nueva entrada
    const newEntry = this.libraryRepo.create({
      user: { id: userId },
      book: { id: bookId },
      status,
    });
    return await this.libraryRepo.save(newEntry);
  }

  /**
   * Actualiza el estado de un libro que ya está en la biblioteca.
   */
  async updateBookStatus(userId: number, bookId: number, status: LibraryStatus) {
    const entry = await this.libraryRepo.findOneBy({
      user: { id: userId },
      book: { id: bookId },
    });

    if (!entry) {
      throw new NotFoundError("Book not found in this user's library");
    }

    entry.status = status;
    return await this.libraryRepo.save(entry);
  }

  /**
   * Elimina un libro de la biblioteca de un usuario.
   */
  async removeBookFromLibrary(userId: number, bookId: number) {
    const result = await this.libraryRepo.delete({
      user: { id: userId },
      book: { id: bookId },
    });

    if (result.affected === 0) {
      throw new NotFoundError("Book not found in this user's library");
    }
    return { message: "Book removed from library successfully" };
  }
}

export const libraryService = new LibraryService();