import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as argon2 from 'argon2'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
class SeedModule {}

async function main() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: false,
  })
  const config = app.get(ConfigService)

  const databaseUrl = config.getOrThrow<string>('DATABASE_URL')
  const seedPassword = config.getOrThrow<string>('SEED_PASSWORD')

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  const prisma = new PrismaClient({ adapter })

  try {
    await prisma.user.deleteMany()
    const passwordHash = await argon2.hash(seedPassword)

    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'client@example.com',
          passwordHash,
          role: 'CLIENT',
          firstName: 'Клиент',
          lastName: 'Клиентов',
        },
      }),
      prisma.user.create({
        data: {
          email: 'admin@example.com',
          passwordHash,
          role: 'ADMIN',
          firstName: 'Админ',
          lastName: 'Админов',
        },
      }),
    ])

    console.log(`Seed завершён: ${users.length} пользователя`)
  } finally {
    await prisma.$disconnect()
    await app.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
