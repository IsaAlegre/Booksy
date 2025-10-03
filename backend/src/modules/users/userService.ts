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

  async searchByUsername(query: string): Promise<Partial<User>[]> {
    // Usamos ILike para una búsqueda case-insensitive y parcial (ej: 'jo' encuentra 'John' y 'joy')
    // Usamos .select() para devolver SOLO los campos públicos.
    return this.userRepo.find({
      where: {
        username: ILike(`%${query}%`),
      },
      select: ["id", "username"], // Define aquí qué campos son públicos
      take: 10, // Limita el número de resultados para no sobrecargar la respuesta
    });
  }

  // NUEVO MÉTODO: Obtener un perfil público por ID
  async findProfileById(id: number): Promise<Partial<User> | null> {
    // De nuevo, usamos .select() para garantizar que solo se devuelvan datos públicos.
    return this.userRepo.findOne({
      where: { id },
      select: ["id", "username"],
    });
  }
}


export const userService = new UserService();