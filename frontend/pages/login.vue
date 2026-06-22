<template>
  <div class="login-wrap">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">Вход</h2>
      </template>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        class="login-alert"
      />

      <el-form label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="Email">
          <el-input v-model="form.email" type="email" placeholder="user1@example.com" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="••••••••"
          />
        </el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="login-submit"
        >
          Войти
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({ layout: false })

const { login, isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  await navigateTo('/panel')
}

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(form.email, form.password)
    await navigateTo('/panel')
  } catch (e) {
    const res = (e as AxiosError<{ code?: string; retryAfter?: number }>).response

    if (res?.data?.code === 'TOO_MANY_REQUESTS') {
      error.value = `Слишком много попыток. Попробуйте позже.`
    } else {
      error.value = 'Неверный email или пароль'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
}
.login-card {
  width: 360px;
}
.login-title {
  margin: 0;
  text-align: center;
}
.login-alert {
  margin-bottom: 16px;
}
.login-submit {
  width: 100%;
}
</style>