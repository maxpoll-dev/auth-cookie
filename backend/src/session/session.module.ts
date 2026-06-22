import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { SessionStore } from './session.store'
import { SessionGuard } from './session.guard'
import { RolesGuard } from './roles.guard'
import { LoginThrottle } from './login-throttle.service'

@Global()
@Module({
  providers: [RedisService, SessionStore, SessionGuard, RolesGuard, LoginThrottle],
  exports: [RedisService, SessionStore, SessionGuard, RolesGuard, LoginThrottle],
})
export class SessionModule {}
