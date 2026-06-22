<template>
  <div>
    <h1>Данные</h1>

    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID">{{ profile?.id }}</el-descriptions-item>
      <el-descriptions-item label="Email">{{ profile?.email }}</el-descriptions-item>
      <el-descriptions-item label="Имя">{{ profile?.firstName }} {{ profile?.lastName }}</el-descriptions-item>
      <el-descriptions-item label="Роль">{{ roleLabel(profile?.role) }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { profile } = useAuth()
</script>