import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { User } from "./entities/user.entity"
import { RelationshipsModule } from "../relationships/relationships.module"
import { MicropostsModule } from "../microposts/microposts.module"

@Module({
  imports: [TypeOrmModule.forFeature([User]), RelationshipsModule, MicropostsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
