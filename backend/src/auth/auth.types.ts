import type { UserRole } from '../../generated/prisma/enums'

export interface AuthUserRow {
  id: string
  passwordHash: string
  role: UserRole
}

export interface AuthSession {
  user: {
    id: string
    role: UserRole
  }
  sessionToken: string
}
