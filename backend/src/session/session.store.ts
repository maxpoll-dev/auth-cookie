import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'node:crypto'
import type { UserRole } from '../../generated/prisma/enums'
import type { Env } from '../config/env.schema'
import { RedisService } from './redis.service'
import { SESSION_REDIS_PREFIX } from './session.constants'

export interface SessionData {
  userId: string
  role: UserRole
  createdAt: number
}

@Injectable()
export class SessionStore {
  private readonly ttlSeconds: number

  constructor(
    private readonly redis: RedisService,
    config: ConfigService<Env, true>,
  ) {
    this.ttlSeconds = config.get('SESSION_TTL_SECONDS', { infer: true })
  }

  get ttl(): number {
    return this.ttlSeconds
  }

  async create(data: Omit<SessionData, 'createdAt'>): Promise<string> {
    const token = randomBytes(32).toString('hex')
    const payload: SessionData = { ...data, createdAt: Date.now() }

    await this.redis.client.setex(this.sessionKey(token), this.ttlSeconds, JSON.stringify(payload))

    return token
  }

  async get(token: string): Promise<SessionData | null> {
    const raw = await this.redis.client.get(this.sessionKey(token))
    if (raw === null) return null

    try {
      return JSON.parse(raw) as SessionData
    } catch {
      await this.redis.client.del(this.sessionKey(token))
      return null
    }
  }

  async touch(token: string): Promise<void> {
    await this.redis.client.expire(this.sessionKey(token), this.ttlSeconds)
  }

  async destroy(token: string): Promise<void> {
    await this.redis.client.del(this.sessionKey(token))
  }

  private sessionKey(token: string): string {
    return `${SESSION_REDIS_PREFIX}${token}`
  }
}
