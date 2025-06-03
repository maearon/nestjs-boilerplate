import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("microposts")
export class Micropost {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 140 })
  content: string

  @Column({ nullable: true })
  picture: string

  @Column()
  user_id: number

  @ManyToOne(
    () => User,
    (user) => user.microposts,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "user_id" })
  user: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
