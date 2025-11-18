import { AppDataSource } from "../../config/data_source.js";
import { User } from "./userEntity.js";
import type { Repository } from "typeorm";
import { ILike } from "typeorm";

export class UserService {
  private get userRepo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }
  async getAll() {
    return await this.userRepo.find();
  }


  async delete(id: number): Promise<void> {
    const userToDelete = await this.userRepo.findOneBy({ id });
    if (!userToDelete) {
      // Lanza un error si el usuario no se encuentra
      throw new Error("User not found");
    }
    await this.userRepo.remove(userToDelete);
  }

  async findById(id: number, includePrivateData: boolean = true) {
    const query = this.userRepo.createQueryBuilder("user").where("user.id = :id", { id });

    if (includePrivateData) {
      // Un admin o el propio usuario puede ver todo
      return query.getOne();
    } else {
      // Un usuario público solo ve campos seleccionados
      return query.select(["user.id", "user.username"]).getOne();
    }
  }

  // Búsqueda simple por username
  async searchByUsername(query: string): Promise<Partial<User>[]> {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query cannot be empty");
    }

    if (query.length > 50) {
      throw new Error("Search query is too long (max 50 characters)");
    }

    return this.userRepo.find({
      where: {
        username: ILike(`%${query}%`),
      },
      select: ["id", "username", "profilePicture"],
      take: 20,
      order: {
        username: "ASC",
      },
    });
  }

  
  async findProfileById(id: number): Promise<Partial<User> | null> {
    return this.userRepo.findOne({
      where: { id },
      select: ["id", "username", "profilePicture", "description"], // Campos públicos del perfil
    });
  }

  async getPublicProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["libraryEntries", "libraryEntries.book"],
      select: ["id", "username", "profilePicture", "description"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Retornar solo datos públicos
    return {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
      description: user.description,
      libraryEntries: user.libraryEntries || [],
    };
  }

  async updateProfile(
    userId: number,
    updates: { description?: string | undefined; profilePicture?: string | undefined }
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar descripción si se proporciona
    if (updates.description !== undefined) {
      user.description = updates.description;
    }

    // Actualizar foto de perfil si se proporciona
    if (updates.profilePicture !== undefined) {
      user.profilePicture = updates.profilePicture;
    }

    // Guardar los cambios
    return this.userRepo.save(user);
  }
}


export const userService = new UserService();