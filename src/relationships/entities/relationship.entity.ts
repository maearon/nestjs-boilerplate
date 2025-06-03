import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("relationships")
@Unique(["follower_id", "followed_id"])
export class Relationship {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  follower_id: number

  @Column()
  followed_id: number

  @ManyToOne(
    () => User,
    (user) => user.active_relationships,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "follower_id" })
  follower: User

  @ManyToOne(
    () => User,
    (user) => user.passive_relationships,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "followed_id" })
  followed: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
