export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['axios'],
  async setup() {
    const { session, fetchSession } = useAuth()

    if (session.value === null) {
      await fetchSession()
    }
  },
})
