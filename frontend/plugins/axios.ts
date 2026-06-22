import axios, { type AxiosInstance } from 'axios'

export default defineNuxtPlugin({
  name: 'axios',
  setup() {
    const config = useRuntimeConfig()
    const baseURL = import.meta.server ? config.apiBaseServer : config.public.apiBase

    const instance = axios.create({
      baseURL,
      withCredentials: true,
    })

    if (import.meta.server) {
      const cookie = useRequestHeaders(['cookie']).cookie
      if (cookie) {
        instance.defaults.headers.common.cookie = cookie
      }
    }

    return {
      provide: { axios: instance },
    }
  },
})

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}