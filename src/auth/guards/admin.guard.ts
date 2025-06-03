import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common"
import type { Observable } from "rxjs"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    return user && user.admin
  }
}
