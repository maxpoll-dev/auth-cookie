import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { UserRow } from './user.types'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserRow | null> {
    const rows = await this.prisma.$queryRaw<UserRow[]>`
      SELECT id,
             email,
             role,
             first_name AS "firstName",
             last_name AS "lastName"
      FROM users
      WHERE id = ${id}
      LIMIT 1`
    return rows[0] ?? null
  }
}
