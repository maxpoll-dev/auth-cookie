<template>
  <div class="layout">
    <el-menu :default-active="route.path" mode="horizontal" router :ellipsis="false">
      <el-menu-item index="/panel">Главная</el-menu-item>
      <el-menu-item index="/panel/about">Данные</el-menu-item>
      <el-menu-item v-if="isAdmin" index="/panel/admin">Управление</el-menu-item>

      <div class="spacer" />

      <div class="header-right">
        <span v-if="profile" class="user-email">{{ profile.email }}</span>
        <el-button size="small" type="danger" plain @click="logout">Выйти</el-button>
      </div>
    </el-menu>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { profile, isAdmin, fetchProfile, logout } = useAuth()

if (profile.value === null) {
  await fetchProfile()
}
</script>

<style scoped>
.content {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.spacer {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.user-email {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>