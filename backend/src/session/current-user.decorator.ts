import {
  createParamDecorator,
  type ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Request } from 'express'
import type { AuthenticatedUser } from './session.types'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest<Request>()

    if (req.user === undefined) {
      throw new InternalServerErrorException('@CurrentUser used without SessionGuard')
    }

    return req.user
  },
)
