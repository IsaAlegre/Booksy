import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"; // Importar la entidad Library
import type { Library } from "../libraries/libraryEntity.js"; // Importar la entidad Library
import type { Review } from "../reviews/reviewEntity.js";

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true , type: "varchar" })
  username!: string;

  @Column({ unique: true , type: "varchar" })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "text", nullable: true }) 
  profilePicture?: string;

  @Column({ type: "text", nullable: true }) 
  description?: string;
  
  @Column({ type: "varchar", nullable: true, select: false }) // select: false para no exponerlo en queries normales
  passwordResetToken?: string | null;

  @Column({ type: "timestamp", nullable: true, select: false })
  passwordResetExpires?: Date | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @OneToMany("Library", (library: Library) => library.user)
  libraryEntries!: Library[];
  
  @OneToMany("Review", (review:Review) => review.user)
  reviews!: Review[];

}