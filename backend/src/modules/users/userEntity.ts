import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Library } from "../libraries/libraryEntity"; // Importar la entidad Library
import { Review } from "../reviews/reviewEntity"; 

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

  @Column({ unique: true , type: "varchar" })
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @OneToMany(() => Library, (library) => library.user)
  libraryEntries!: Library[];
  
  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

}