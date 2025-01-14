<template>
  <div class="bucket-list-view">
    <BucketList />
  </div>
</template>

<script setup lang="ts">
import BucketList from '@/components/bucket/BucketList.vue'
</script>

<style scoped>
.bucket-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style> 