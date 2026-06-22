import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import type { Env } from '../config/env.schema'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  readonly client: Redis

  constructor(config: ConfigService<Env, true>) {
    this.client = new Redis(config.get('REDIS_URL', { infer: true }), {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect()
    this.logger.log('Redis connected')
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit()
  }

  async ping(): Promise<void> {
    await this.client.ping()
  }
}
