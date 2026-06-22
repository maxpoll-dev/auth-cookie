export type UserRole = 'ADMIN' | 'CLIENT'

export interface SessionUser {
  id: string
  role: UserRole
}

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

export const useAuth = () => {
  const session = useState<SessionUser | null>('auth:session', () => null)
  const profile = useState<UserProfile | null>('auth:profile', () => null)

  const { $axios } = useNuxtApp()

  const fetchSession = async () => {
    try {
      const { data } = await $axios.get<SessionUser>('/auth/session')
      session.value = data
    } catch {
      session.value = null
    }
    return session.value
  }

  const fetchProfile = async () => {
    try {
      const { data } = await $axios.get<UserProfile>('/user/profile')
      profile.value = data
    } catch {
      profile.value = null
    }
    return profile.value
  }

  const login = async (email: string, password: string) => {
    await $axios.post('/auth/login', { email, password })
    await fetchSession()
  }

  const logout = async () => {
    await $axios.post('/auth/logout')

    session.value = null
    profile.value = null

    await navigateTo('/login')
  }

  const isAuthenticated = computed(() => session.value !== null)
  const isAdmin = computed(() => session.value?.role === 'ADMIN')

  return { session, profile, fetchSession, fetchProfile, login, logout, isAuthenticated, isAdmin }
}