import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'
import { SessionStore } from './session.store'
import { SESSION_COOKIE } from './session.constants'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionStore) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>()

    const cookies = req.cookies as Record<string, string | undefined> | undefined
    const token = cookies?.[SESSION_COOKIE]

    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException({ code: 'NO_SESSION' })
    }

    const session = await this.sessions.get(token)
    if (session === null) {
      throw new UnauthorizedException({ code: 'NO_SESSION' })
    }

    await this.sessions.touch(token)

    req.user = {
      id: session.userId,
      role: session.role,
    }

    return true
  }
}
