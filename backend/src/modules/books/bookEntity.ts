import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import type { Library } from "../libraries/libraryEntity.js";
import type { Review } from "../reviews/reviewEntity.js";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar" })
  author!: string;

  @Column({ nullable: true, type: "varchar" })
  genre?: string;

  @Column({ nullable: true, type: "int" })
  year?: number;

  @Column({ nullable: true, type: "int" })
  pages?: number;

  @Column({ nullable: true, type: "varchar" })
  description?: string;

  @Column({ nullable: true, type: "varchar" })
  coverUrl?: string;

  @OneToMany("Library", (library: Library) => library.book)
  libraryEntries!: Library[];

  @OneToMany("Review", (review:Review) => review.book)
  reviews!: Review[];
}