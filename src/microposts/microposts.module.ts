import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MicropostsService } from "./microposts.service"
import { MicropostsController } from "./microposts.controller"
import { Micropost } from "./entities/micropost.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Micropost])],
  controllers: [MicropostsController],
  providers: [MicropostsService],
  exports: [MicropostsService],
})
export class MicropostsModule {}
