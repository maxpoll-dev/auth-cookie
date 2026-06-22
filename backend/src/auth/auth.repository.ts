import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { AuthUserRow } from './auth.types'

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserRow | null> {
    const rows = await this.prisma.$queryRaw<AuthUserRow[]>`
      SELECT id,
             password_hash AS "passwordHash",
             role
      FROM users
      WHERE email = ${email}
      LIMIT 1`
    return rows[0] ?? null
  }
}
