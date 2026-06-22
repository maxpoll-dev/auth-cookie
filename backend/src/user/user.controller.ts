import { Controller, Get, UseGuards } from '@nestjs/common'
import { SessionGuard } from '../session/session.guard'
import { CurrentUser } from '../session/current-user.decorator'
import { UserService } from './user.service'
import type { AuthenticatedUser } from '../session/session.types'

@Controller('user')
@UseGuards(SessionGuard)
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('profile')
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.users.profile(user.id)
  }
}
