import type { UserRole } from '../../generated/prisma/enums'

export interface UserRow {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
}
