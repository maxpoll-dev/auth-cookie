import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { RedisService } from '../session/redis.service'

@Controller('healthz')
export class HealthController {
  constructor(private readonly redis: RedisService) {}

  @Get()
  async check() {
    try {
      await this.redis.ping()
    } catch {
      throw new ServiceUnavailableException({ status: 'error', redis: 'down' })
    }

    return { status: 'ok', redis: 'up' }
  }
}
