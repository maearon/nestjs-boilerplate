import { PartialType } from "@nestjs/swagger"
import { CreateMicropostDto } from "./create-micropost.dto"

export class UpdateMicropostDto extends PartialType(CreateMicropostDto) {}
