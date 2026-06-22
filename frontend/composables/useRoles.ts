import type { UserRole } from './useAuth'

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Администратор',
  CLIENT: 'Клиент',
}

export const roleLabel = (role?: UserRole | null): string => (role ? ROLE_LABEL[role] : '')