<template>
  <div class="bucket-list-view">
    <BucketDetail :bucketId="$route.params.id" />
  </div>
</template>

<script setup lang="ts">
import BucketDetail from '@/components/bucket/BucketDetail.vue'
</script>

<style scoped>
.bucket-list-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style> 