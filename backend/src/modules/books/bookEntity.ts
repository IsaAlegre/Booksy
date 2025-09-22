import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Library } from "../libraries/libraryEntity";
import { Review } from "../reviews/reviewEntity";

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

  @OneToMany(() => Library, (library) => library.book)
  libraryEntries!: Library[];

  @OneToMany(() => Review, (review) => review.book)
  reviews!: Review[];
}