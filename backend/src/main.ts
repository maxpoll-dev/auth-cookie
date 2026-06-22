import { ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from 'src/config/env.schema'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api', { exclude: ['healthz'] })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  )

  const config = app.get<ConfigService<Env, true>>(ConfigService)
  const port = config.get('PORT', { infer: true })
  await app.listen(port)

  new Logger('Bootstrap').log(`API listening on :${port.toString()}`)
}

void bootstrap()
