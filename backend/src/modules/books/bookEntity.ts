import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
import type { Library } from "../libraries/libraryEntity.js";
import type { Review } from "../reviews/reviewEntity.js";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  title!: string;

  @Column({ type: "varchar", length:255, nullable: false })
  author!: string;

  @Column({ nullable: true, type: "varchar"})
  genre?: string| null;

  @Column({ nullable: true, type: "int" })
  year?: number | null;

  @Column({ nullable: true, type: "int" })
  pages?: number | null;

  @Column({ nullable: true, type: "varchar" })
  description?: string | null;

  @Column({ nullable: true, length: 255, type: "varchar" })
  coverUrl?: string | null;
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany("Library", (library: Library) => library.book)
  libraryEntries!: Library[];

  @OneToMany("Review", (review:Review) => review.book)
  reviews!: Review[];
}