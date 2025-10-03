import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "../users/userEntity";

@Entity("suggestions")
export class Suggestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  title!: string;

  @Column({ type: "varchar", nullable: true })
  author?: string;

  @Column({ type: "varchar", nullable: true })
  genre?: string;

  @Column({ type: "text", nullable: true })
  suggestion?: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "boolean", default: false })
  seen!: boolean;
}