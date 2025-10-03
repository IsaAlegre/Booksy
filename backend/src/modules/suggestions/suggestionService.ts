import { AppDataSource } from "../../config/data_source";
import { Suggestion } from "./suggestionEntity";
import { User } from "../users/userEntity";
import { NotFoundError } from "../../errors/NotFoundErrors";

export class SuggestionService {
  private repo = AppDataSource.getRepository(Suggestion);
  private userRepo = AppDataSource.getRepository(User);

  async createSuggestion(userId: number | undefined, payload: {
    title: string;
    author?: string;
    genre?: string;
    suggestion?: string;
  }) {
    let user: User | undefined;
    if (userId !) {
      const found = await this.userRepo.findOneBy({ id: userId });
      if (!found) throw new NotFoundError("User not found");
      user = found; 
    }

    const suggestionPayload: {
      title: string;
      author?: string;
      genre?: string;
      suggestion?: string;
      user?: User;
    } = {
      title: payload.title,
    };

    if (payload.author !== undefined) suggestionPayload.author = payload.author;
    if (payload.genre !== undefined) suggestionPayload.genre = payload.genre;
    if (payload.suggestion !== undefined) suggestionPayload.suggestion = payload.suggestion;
    if (user) suggestionPayload.user = user;

    const entity = this.repo.create(suggestionPayload);
    return this.repo.save(entity);
  }

  async getAllSuggestions() {
    return this.repo.find({
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async markAsSeen(id: number) {
    const s = await this.repo.findOneBy({ id });
    if (!s) throw new NotFoundError("Suggestion not found");
    s.seen = true;
    return this.repo.save(s);
  }
}

export const suggestionService = new SuggestionService();