import { IsEmail, IsString, MinLength, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @MaxLength(255)
  email: string

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string
}
