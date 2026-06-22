<template>
  <div>
    <h1>Редактирование</h1>

    <el-alert
      v-if="error"
      title="Произошла ошибка, попробуйте обновить страницу"
      type="error"
      :closable="false"
    />

    <el-card v-else>
      <el-tag type="success" size="large">testAdmin: {{ data?.testAdmin }}</el-tag>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'] })

const { $axios } = useNuxtApp()

const { data, error } = await useAsyncData('admin-data', async () => {
  const res = await $axios.get<{ testAdmin: boolean }>('/admin')
  return res.data
})
</script>
