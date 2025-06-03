import { IsString, MaxLength, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateMicropostDto {
  @ApiProperty({ example: "This is my first micropost!" })
  @IsString()
  @MaxLength(140)
  content: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture?: string
}
