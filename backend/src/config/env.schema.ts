import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().int().positive(),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  SESSION_TTL_SECONDS: z.coerce.number().int().positive(),

  COOKIE_SECURE: z.string().transform((v: string) => v === 'true'),
})

export type Env = z.infer<typeof envSchema>

export const validateEnv = (config: Record<string, unknown>): Env => {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    const formatted = result.error.issues
      .map((e: z.core.$ZodIssue) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n')

    throw new Error(`Invalid environment variables:\n${formatted}`)
  }

  return result.data
}
