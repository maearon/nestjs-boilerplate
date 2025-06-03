import { Controller, Get, Render } from "@nestjs/common"
import type { AppService } from "./app.service"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("home")
  getHome() {
    return {
      title: "Sample App",
      message: "Welcome to the Sample App!",
    }
  }
}
