import { Controller, Get, UseGuards } from '@nestjs/common'
import { SessionGuard } from '../session/session.guard'
import { RolesGuard } from '../session/roles.guard'
import { Roles } from '../session/roles.decorator'

@Controller('admin')
@UseGuards(SessionGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  @Get()
  data() {
    return { testAdmin: true }
  }
}
