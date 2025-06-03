import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { User } from "./entities/user.entity"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import type { PaginationDto } from "../common/dto/pagination.dto"

@Injectable()
export class UsersService {
  constructor(private usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException("Email already exists")
    }

    const user = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: { name: "ASC" },
      relations: ["microposts"],
    })

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["microposts", "active_relationships", "passive_relationships"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)
    Object.assign(user, updateUserDto)
    return this.usersRepository.save(user)
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id)
    await this.usersRepository.remove(user)
  }

  async activate(id: number): Promise<User> {
    const user = await this.findOne(id)
    user.activated = true
    user.activated_at = new Date()
    user.activation_digest = null
    return this.usersRepository.save(user)
  }

  async setResetDigest(email: string, digest: string): Promise<User> {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    user.reset_digest = digest
    user.reset_sent_at = new Date()
    return this.usersRepository.save(user)
  }

  async resetPassword(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    user.password = password
    user.reset_digest = null
    user.reset_sent_at = null
    return this.usersRepository.save(user)
  }
}
