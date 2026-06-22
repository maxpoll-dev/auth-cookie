import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as argon2 from 'argon2'
import { SessionStore } from '../session/session.store'
import { LoginThrottle } from '../session/login-throttle.service'
import { AuthRepository } from './auth.repository'
import type { AuthSession, AuthUserRow } from './auth.types'
import type { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly sessions: SessionStore,
    private readonly throttle: LoginThrottle,
  ) {}

  async login(dto: LoginDto): Promise<AuthSession> {
    const email = dto.email.trim().toLowerCase()

    await this.throttle.assertAllowed(email)

    const user = await this.repo.findByEmail(email)
    if (user === null) {
      await this.throttle.registerFailure(email)
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS' })
    }

    const valid = await argon2.verify(user.passwordHash, dto.password)
    if (!valid) {
      await this.throttle.registerFailure(email)
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS' })
    }

    await this.throttle.reset(email)
    return this.issueSession(user)
  }

  async logout(token: string | undefined): Promise<void> {
    if (token === undefined || token.length === 0) return
    await this.sessions.destroy(token)
  }

  private async issueSession(user: AuthUserRow): Promise<AuthSession> {
    const sessionToken = await this.sessions.create({
      userId: user.id,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        role: user.role,
      },
      sessionToken,
    }
  }
}
