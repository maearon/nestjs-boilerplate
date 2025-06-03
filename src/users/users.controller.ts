import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Render,
  Redirect,
  ParseIntPipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { UsersService } from "./users.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import type { PaginationDto } from "../common/dto/pagination.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { AdminGuard } from "../auth/guards/admin.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import type { User } from "./entities/user.entity"
import type { MicropostsService } from "../microposts/microposts.service"
import type { RelationshipsService } from "../relationships/relationships.service"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly micropostsService: MicropostsService,
    private readonly relationshipsService: RelationshipsService,
  ) {}

  @Get()
  @Render('users/index')
  async index(@Query() paginationDto: PaginationDto) {
    const result = await this.usersService.findAll(paginationDto);
    return {
      title: 'All users',
      ...result,
    };
  }

  @Get("new")
  @Render("users/new")
  newUser() {
    return { title: "Sign up" }
  }

  @Post()
  @Redirect('/login')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { url: '/login' };
  }

  @Get(":id")
  @Render("users/show")
  async show(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto) {
    const user = await this.usersService.findOne(id)
    const microposts = await this.micropostsService.findByUser(id, paginationDto)
    const followingCount = await this.relationshipsService.getFollowingCount(id)
    const followersCount = await this.relationshipsService.getFollowersCount(id)

    return {
      title: user.name,
      user,
      microposts: microposts.microposts,
      following_count: followingCount,
      followers_count: followersCount,
      ...microposts,
    }
  }

  @Get(":id/edit")
  @UseGuards(JwtAuthGuard)
  @Render("users/edit")
  async edit(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    const user = await this.usersService.findOne(id)
    return {
      title: "Edit user",
      user,
    }
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    const user = await this.usersService.update(id, updateUserDto)
    return { user }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Get(":id/following")
  @Render("users/show_follow")
  async following(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto) {
    const user = await this.usersService.findOne(id)
    const following = await this.relationshipsService.getFollowing(id, paginationDto)

    return {
      title: "Following",
      user,
      users: following.users,
      ...following,
    }
  }

  @Get(":id/followers")
  @Render("users/show_follow")
  async followers(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto) {
    const user = await this.usersService.findOne(id)
    const followers = await this.relationshipsService.getFollowers(id, paginationDto)

    return {
      title: "Followers",
      user,
      users: followers.users,
      ...followers,
    }
  }

  // API Routes
  @Get('api/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get('api/users/:id')
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
