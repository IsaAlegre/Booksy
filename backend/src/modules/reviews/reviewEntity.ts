import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,  JoinColumn} from "typeorm";
import { User } from "../users/userEntity";
import { Book } from "../books/bookEntity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: true })
    comment?: string;

    @Column({ type: "int", nullable: true })
    rating?: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: "userId" }) 
    user!: User;

    @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: "bookId" }) 
    book!: Book;
}