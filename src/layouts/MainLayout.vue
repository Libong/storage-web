<template>
  <div class="main-layout">
    <header class="header">
      <div class="logo">
        <img :src="IMAGES.logo" alt="Anime Cloud" />
        <h1>Reborn Cloud</h1>
      </div>
<!--      <nav class="nav-menu">-->
<!--        <router-link to="/">首页</router-link>-->
<!--        <router-link to="/buckets">我的存储</router-link>-->
<!--        <router-link to="/help">帮助</router-link>-->
<!--      </nav>-->
      <div class="user-section">
<!--        <SearchBar />-->
        <UserAvatar v-if="isLoggedIn" />
<!--        <template v-else>-->
<!--          <router-link to="/login" class="btn-login">登录</router-link>-->
<!--          <router-link to="/register" class="btn-register">注册</router-link>-->
<!--        </template>-->
      </div>
    </header>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IMAGES } from '@/assets/images'
import SearchBar from '@/components/common/SearchBar.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const isLoggedIn = ref(false)
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f4f8fb 0%, #e8f0f8 100%);
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo img {
  height: 40px;
}

.logo h1 {
  font-size: 1.5rem;
  color: #5c6bc0;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-menu a {
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #5c6bc0;
}

.main-content {
  flex: 1;
  padding: 0.5rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
</style> 