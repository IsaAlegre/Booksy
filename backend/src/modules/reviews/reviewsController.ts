import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./reviewService.js";

const reviewService = new ReviewService();

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Obtén el parámetro de forma segura
      const bookIdParam = req.params.bookId;
      // 2. Verifica que existe
      if (!bookIdParam) {
        return res.status(400).json({ message: "Book ID must be provided in the URL." });
      }
      // 3. Ahora puedes usarlo con seguridad
      const bookId = parseInt(bookIdParam, 10);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid Book ID in URL." });
      }

      const userId = req.user!.userId;
      const { comment, rating } = req.body;

      const review = await reviewService.createReview(userId, bookId, comment, rating);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Obtén el parámetro de forma segura
      const reviewIdParam = req.params.reviewId;
      // 2. Verifica que existe
      if (!reviewIdParam) {
        return res.status(400).json({ message: "Review ID must be provided in the URL." });
      }
      // 3. Ahora puedes usarlo con seguridad
      const reviewId = parseInt(reviewIdParam, 10);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid Review ID in URL." });
      }

      const userId = req.user!.userId;

      const result = await reviewService.deleteReview(reviewId, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getByBook(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Obtén el parámetro de forma segura
      const bookIdParam = req.params.bookId;
      // 2. Verifica que existe
      if (!bookIdParam) {
        return res.status(400).json({ message: "Book ID must be provided in the URL." });
      }
      // 3. Ahora puedes usarlo con seguridad
      const bookId = parseInt(bookIdParam, 10);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid Book ID in URL." });
      }

      const reviews = await reviewService.getReviewsByBook(bookId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }
}