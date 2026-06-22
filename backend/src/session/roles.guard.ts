import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import type { UserRole } from '../../generated/prisma/enums'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    if (roles === undefined || roles.length === 0) return true

    const req = ctx.switchToHttp().getRequest<Request>()
    if (req.user === undefined) {
      throw new UnauthorizedException({ code: 'NO_SESSION' })
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException({ code: 'FORBIDDEN' })
    }

    return true
  }
}
