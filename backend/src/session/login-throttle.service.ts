import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RedisService } from './redis.service'
import {
  LOGIN_ATTEMPTS_PREFIX,
  LOGIN_BLOCK_PREFIX,
  LOGIN_BLOCK_SECONDS,
  LOGIN_MAX_ATTEMPTS,
} from './session.constants'

@Injectable()
export class LoginThrottle {
  constructor(private readonly redis: RedisService) {}

  async assertAllowed(email: string): Promise<void> {
    const ttl = await this.redis.client.ttl(this.blockKey(email))

    if (ttl > 0) {
      throw new HttpException({ code: 'TOO_MANY_REQUESTS' }, HttpStatus.TOO_MANY_REQUESTS)
    }
  }

  async registerFailure(email: string): Promise<void> {
    const key = this.attemptsKey(email)
    const attempts = await this.redis.client.incr(key)

    if (attempts === 1) {
      await this.redis.client.expire(key, LOGIN_BLOCK_SECONDS)
    }

    if (attempts >= LOGIN_MAX_ATTEMPTS) {
      await this.redis.client
        .multi()
        .set(this.blockKey(email), '1', 'EX', LOGIN_BLOCK_SECONDS)
        .del(key)
        .exec()
    }
  }

  async reset(email: string): Promise<void> {
    await this.redis.client.del(this.attemptsKey(email), this.blockKey(email))
  }

  private attemptsKey(email: string): string {
    return `${LOGIN_ATTEMPTS_PREFIX}${email.toLowerCase()}`
  }

  private blockKey(email: string): string {
    return `${LOGIN_BLOCK_PREFIX}${email.toLowerCase()}`
  }
}
