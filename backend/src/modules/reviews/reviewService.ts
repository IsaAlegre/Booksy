import { AppDataSource } from "../../config/data_source.js";
import { Review } from "./reviewEntity.js";
import { User } from "../users/userEntity.js";
import { Book } from "../books/bookEntity.js";

export class ReviewService {
  private reviewRepository = AppDataSource.getRepository(Review);
  private userRepository = AppDataSource.getRepository(User);
  private bookRepository = AppDataSource.getRepository(Book);

  async createReview(userId: number, bookId: number, comment: string, rating: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!user || !book) {
      throw new Error("User or Book not found");
    }

    const review = this.reviewRepository.create({
      comment,
      rating,
      user,
      book,
    });

    return await this.reviewRepository.save(review);
  }

  async deleteReview(reviewId: number, userId: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ["user"],
    });

    if (!review) {
      throw new Error("Review not found");
    }

    // solo el dueño de la review puede borrarla
    if (review.user.id !== userId) {
      throw new Error("Not authorized to delete this review");
    }

    await this.reviewRepository.remove(review);
    return { message: "Review deleted successfully" };
  }

  async getReviewsByBook(bookId: number) {
    return await this.reviewRepository.find({
      where: { book: { id: bookId } },
      relations: ["user"],
      order: { createdAt: "DESC" }
    });
  }
}
