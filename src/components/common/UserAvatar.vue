<template>
  <div class="user-avatar">
    <img :src="IMAGES.defaultAvatar" alt="User Avatar">
  </div>
</template>

<script setup lang="ts">
import { IMAGES } from '@/assets/images'
</script>

<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 