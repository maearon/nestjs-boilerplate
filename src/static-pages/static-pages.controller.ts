import { Controller, Get, Render, Query } from "@nestjs/common"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import type { User } from "../users/entities/user.entity"
import type { MicropostsService } from "../microposts/microposts.service"
import type { RelationshipsService } from "../relationships/relationships.service"
import type { PaginationDto } from "../common/dto/pagination.dto"

@Controller()
export class StaticPagesController {
  constructor(
    private readonly micropostsService: MicropostsService,
    private readonly relationshipsService: RelationshipsService,
  ) {}

  @Get()
  @Render("static_pages/home")
  async home(@Query() paginationDto?: PaginationDto, @CurrentUser() user?: User) {
    if (user) {
      const followingIds = await this.relationshipsService.getFollowingIds(user.id)
      const feed = await this.micropostsService.findFeed(user.id, followingIds, paginationDto)
      return {
        title: "Home",
        user,
        feed: feed.microposts,
        ...feed,
      }
    }

    return { title: "Sample App" }
  }

  @Get("help")
  @Render("static_pages/help")
  help() {
    return { title: "Help" }
  }

  @Get("about")
  @Render("static_pages/about")
  about() {
    return { title: "About" }
  }

  @Get("contact")
  @Render("static_pages/contact")
  contact() {
    return { title: "Contact" }
  }
}
