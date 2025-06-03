import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, In } from "typeorm"
import { Micropost } from "./entities/micropost.entity"
import type { CreateMicropostDto } from "./dto/create-micropost.dto"
import type { UpdateMicropostDto } from "./dto/update-micropost.dto"
import type { PaginationDto } from "../common/dto/pagination.dto"

@Injectable()
export class MicropostsService {
  constructor(
    @InjectRepository(Micropost)
    private micropostsRepository: Repository<Micropost>,
  ) {}

  async create(createMicropostDto: CreateMicropostDto, userId: number): Promise<Micropost> {
    const micropost = this.micropostsRepository.create({
      ...createMicropostDto,
      user_id: userId,
    })
    return this.micropostsRepository.save(micropost)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const [microposts, total] = await this.micropostsRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: "DESC" },
      relations: ["user"],
    })

    return {
      microposts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findByUser(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const [microposts, total] = await this.micropostsRepository.findAndCount({
      where: { user_id: userId },
      skip,
      take: limit,
      order: { created_at: "DESC" },
      relations: ["user"],
    })

    return {
      microposts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findFeed(userId: number, followingIds: number[], paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const userIds = [userId, ...followingIds]

    const [microposts, total] = await this.micropostsRepository.findAndCount({
      where: { user_id: In(userIds) },
      skip,
      take: limit,
      order: { created_at: "DESC" },
      relations: ["user"],
    })

    return {
      microposts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number): Promise<Micropost> {
    const micropost = await this.micropostsRepository.findOne({
      where: { id },
      relations: ["user"],
    })

    if (!micropost) {
      throw new NotFoundException("Micropost not found")
    }

    return micropost
  }

  async update(id: number, updateMicropostDto: UpdateMicropostDto, userId: number): Promise<Micropost> {
    const micropost = await this.findOne(id)

    if (micropost.user_id !== userId) {
      throw new ForbiddenException("You can only edit your own microposts")
    }

    Object.assign(micropost, updateMicropostDto)
    return this.micropostsRepository.save(micropost)
  }

  async remove(id: number, userId: number): Promise<void> {
    const micropost = await this.findOne(id)

    if (micropost.user_id !== userId) {
      throw new ForbiddenException("You can only delete your own microposts")
    }

    await this.micropostsRepository.remove(micropost)
  }
}
