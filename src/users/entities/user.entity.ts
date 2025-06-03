import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm"
import { Exclude } from "class-transformer"
import * as bcrypt from "bcryptjs"
import { Micropost } from "../../microposts/entities/micropost.entity"
import { Relationship } from "../../relationships/entities/relationship.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column()
  @Exclude()
  password: string

  @Column({ default: false })
  admin: boolean

  @Column({ default: false })
  activated: boolean

  @Column({ nullable: true })
  @Exclude()
  activation_digest: string

  @Column({ nullable: true })
  @Exclude()
  reset_digest: string

  @Column({ type: "timestamp", nullable: true })
  reset_sent_at: Date

  @Column({ type: "timestamp", nullable: true })
  activated_at: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    () => Micropost,
    (micropost) => micropost.user,
    {
      cascade: true,
      onDelete: "CASCADE",
    },
  )
  microposts: Micropost[]

  @OneToMany(
    () => Relationship,
    (relationship) => relationship.follower,
  )
  active_relationships: Relationship[]

  @OneToMany(
    () => Relationship,
    (relationship) => relationship.followed,
  )
  passive_relationships: Relationship[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12)
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  gravatar(size = 80): string {
    const crypto = require("crypto")
    const hash = crypto.createHash("md5").update(this.email.toLowerCase()).digest("hex")
    return `https://secure.gravatar.com/avatar/${hash}?s=${size}`
  }
}
