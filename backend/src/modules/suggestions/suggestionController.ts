import type { Request, Response, NextFunction } from "express";
import { suggestionService } from "./suggestionService";

// ...existing code...

export class SuggestionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId ?? undefined; // si hay auth, viene del middleware
      const { title, author, genre, suggestion } = req.body;

      if (!title || typeof title !== "string") {
        return res.status(400).json({ message: "Title is required" });
      }

      const created = await suggestionService.createSuggestion(userId, {
        title,
        author,
        genre,
        suggestion,
      });

      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const all = await suggestionService.getAllSuggestions();
      res.json(all);
    } catch (error) {
      next(error);
    }
  }

  static async markSeen(req: Request, res: Response, next: NextFunction) {
    try {
        const idParam = req.params.id;
        if (!idParam) {
            return res.status(400).json({ message: "ID must be provided in the URL." });
        }
        const id = parseInt(idParam, 10);
        if (isNaN(id)){
            return res.status(400).json({ message: "Invalid id" });
        }
        const updated = await suggestionService.markAsSeen(id);
        res.json(updated);
        } catch (error) {
        next(error);
    }
  }
}

export default SuggestionController;