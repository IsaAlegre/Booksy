import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({ nullable: true })
  year?: number;

  @Column({ nullable: true })
  pages?: number;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ nullable: true })
  coverUrl?: string;
}