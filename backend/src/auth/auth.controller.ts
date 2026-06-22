import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { CurrentUser } from '../session/current-user.decorator'
import { LoginDto } from './dto/login.dto'
import { SessionGuard } from '../session/session.guard'
import { SessionStore } from '../session/session.store'
import { SESSION_COOKIE, SESSION_COOKIE_PATH } from '../session/session.constants'

import type { Env } from '../config/env.schema'
import type { AuthenticatedUser } from '../session/session.types'
import type { CookieOptions, Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionStore,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const session = await this.auth.login(dto)
    this.setSessionCookie(res, session.sessionToken)

    return {
      userId: session.user.id,
      role: session.user.role,
    }
  }

  @Get('session')
  @UseGuards(SessionGuard)
  session(@CurrentUser() user: AuthenticatedUser) {
    return user
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const cookies = req.cookies as Record<string, string | undefined> | undefined
    await this.auth.logout(cookies?.[SESSION_COOKIE])

    this.clearSessionCookie(res)
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE', { infer: true }),
      sameSite: 'lax',
      path: SESSION_COOKIE_PATH,
    }
  }

  private setSessionCookie(res: Response, token: string): void {
    res.cookie(SESSION_COOKIE, token, {
      ...this.cookieOptions(),
      maxAge: this.sessions.ttl * 1000,
    })
  }

  private clearSessionCookie(res: Response): void {
    res.clearCookie(SESSION_COOKIE, this.cookieOptions())
  }
}
