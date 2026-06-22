import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validateEnv } from './config/env.schema'
import { HealthModule } from './health/health.module'
import { PrismaModule } from './prisma/prisma.module'
import { SessionModule } from './session/session.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),

    // Core
    HealthModule,
    PrismaModule,

    // Domains
    SessionModule,
    AuthModule,
    AdminModule,
    UserModule,
  ],
})
export class AppModule {}
