<template>
  <div>
    <h1>Панель</h1>

    <el-card>
      <p>
        Вы вошли как <strong>{{ profile?.email }}</strong>&nbsp;
        <el-tag size="small" :type="profile?.role === 'ADMIN' ? 'danger' : 'info'">
          {{ roleLabel(profile?.role) }}
        </el-tag>
      </p>
      <p>Добро пожаловать. Используйте меню сверху для навигации.</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { profile } = useAuth()
</script>

