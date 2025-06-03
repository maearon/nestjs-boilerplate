import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Relationship } from "./entities/relationship.entity"
import type { PaginationDto } from "../common/dto/pagination.dto"

@Injectable()
export class RelationshipsService {
  constructor(private relationshipsRepository: Repository<Relationship>) {}

  async follow(followerId: number, followedId: number): Promise<Relationship> {
    const existingRelationship = await this.relationshipsRepository.findOne({
      where: { follower_id: followerId, followed_id: followedId },
    })

    if (existingRelationship) {
      throw new ConflictException("Already following this user")
    }

    const relationship = this.relationshipsRepository.create({
      follower_id: followerId,
      followed_id: followedId,
    })

    return this.relationshipsRepository.save(relationship)
  }

  async unfollow(followerId: number, followedId: number): Promise<void> {
    const relationship = await this.relationshipsRepository.findOne({
      where: { follower_id: followerId, followed_id: followedId },
    })

    if (!relationship) {
      throw new NotFoundException("Relationship not found")
    }

    await this.relationshipsRepository.remove(relationship)
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    const relationship = await this.relationshipsRepository.findOne({
      where: { follower_id: followerId, followed_id: followedId },
    })

    return !!relationship
  }

  async getFollowing(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const [relationships, total] = await this.relationshipsRepository.findAndCount({
      where: { follower_id: userId },
      skip,
      take: limit,
      relations: ["followed"],
      order: { created_at: "DESC" },
    })

    const users = relationships.map((rel) => rel.followed)

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getFollowers(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit

    const [relationships, total] = await this.relationshipsRepository.findAndCount({
      where: { followed_id: userId },
      skip,
      take: limit,
      relations: ["follower"],
      order: { created_at: "DESC" },
    })

    const users = relationships.map((rel) => rel.follower)

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getFollowingCount(userId: number): Promise<number> {
    return this.relationshipsRepository.count({
      where: { follower_id: userId },
    })
  }

  async getFollowersCount(userId: number): Promise<number> {
    return this.relationshipsRepository.count({
      where: { followed_id: userId },
    })
  }

  async getFollowingIds(userId: number): Promise<number[]> {
    const relationships = await this.relationshipsRepository.find({
      where: { follower_id: userId },
      select: ["followed_id"],
    })

    return relationships.map((rel) => rel.followed_id)
  }
}
