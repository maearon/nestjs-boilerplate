import { Controller, Post, Delete, Param, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { RelationshipsService } from "./relationships.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import type { User } from "../users/entities/user.entity"

@ApiTags("relationships")
@Controller("relationships")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post(":id")
  @ApiOperation({ summary: "Follow user" })
  async follow(@Param('id') followedId: string, @CurrentUser() user: User) {
    return this.relationshipsService.follow(user.id, Number.parseInt(followedId, 10))
  }

  @Delete(":id")
  @ApiOperation({ summary: "Unfollow user" })
  async unfollow(@Param('id') followedId: string, @CurrentUser() user: User) {
    await this.relationshipsService.unfollow(user.id, Number.parseInt(followedId, 10))
    return { message: "Unfollowed successfully" }
  }
}
