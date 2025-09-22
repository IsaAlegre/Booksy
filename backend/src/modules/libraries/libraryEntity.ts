import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/userEntity";
import { Book } from "../books/bookEntity";

export enum LibraryStatus {
  READ = "read",
  READING = "reading",
  TO_READ = "to-read",
}

@Entity("libraries")
export class Library {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: LibraryStatus,
    default: LibraryStatus.TO_READ,
  })
  status!: LibraryStatus;

  // Relación: Muchas entradas de biblioteca pertenecen a un usuario
  @ManyToOne(() => User, (user) => user.libraryEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" }) // Esto crea la columna 'userId' en la tabla 'libraries'
  user!: User;

  // Relación: Muchas entradas de biblioteca se refieren a un libro
  @ManyToOne(() => Book, (book) => book.libraryEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "bookId" }) // Esto crea la columna 'bookId'
  book!: Book;
}