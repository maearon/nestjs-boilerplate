import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { MicropostsService } from "./microposts.service"
import type { CreateMicropostDto } from "./dto/create-micropost.dto"
import type { UpdateMicropostDto } from "./dto/update-micropost.dto"
import type { PaginationDto } from "../common/dto/pagination.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import type { User } from "../users/entities/user.entity"

@ApiTags("microposts")
@Controller("microposts")
export class MicropostsController {
  constructor(private readonly micropostsService: MicropostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create micropost" })
  @ApiBearerAuth()
  async create(@Body() createMicropostDto: CreateMicropostDto, @CurrentUser() user: User) {
    return this.micropostsService.create(createMicropostDto, user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Get all microposts' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.micropostsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get micropost by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.micropostsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update micropost" })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMicropostDto: UpdateMicropostDto,
    @CurrentUser() user: User,
  ) {
    return this.micropostsService.update(id, updateMicropostDto, user.id)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete micropost" })
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    await this.micropostsService.remove(id, user.id)
    return { message: "Micropost deleted successfully" }
  }
}
