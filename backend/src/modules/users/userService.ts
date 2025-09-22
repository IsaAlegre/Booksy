import { AppDataSource } from "../../config/data_source";
import { User } from "./userEntity";
import type { Repository } from "typeorm";

export class UserService {
  private get userRepo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }
  async getAll() {
    return await this.userRepo.find();
  }

  async create(username: string) {
    const newUser = this.userRepo.create({ username });
    return await this.userRepo.save(newUser);
  }

  async delete(id: number): Promise<void> {
    const userToDelete = await this.userRepo.findOneBy({ id });
    if (!userToDelete) {
      // Lanza un error si el usuario no se encuentra
      throw new Error("User not found");
    }
    await this.userRepo.remove(userToDelete);
  }
}



export const userService = new UserService();