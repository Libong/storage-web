<template>
  <div class="key-info-dialog" :style="{ top: offsetY + 'px', left: offsetX + 'px' }" @click.stop>
    <div class="dialog-header">
      <h3>密钥信息</h3>
    </div>
    <div class="dialog-content">
      <div>
        <span>访问密钥：</span>
        <span>{{ accessKey }}</span>
      </div>
      <div>
        <span>访问密码：</span>
        <span>{{ accessSecret }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  accessKey: string;
  accessSecret: string;
  closeDialog: () => void;
  offsetX: number;
  offsetY: number;
}>();
</script>

<style scoped>
.key-info-dialog {
  position: absolute; /* 绝对定位 */
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 确保在其他元素之上 */
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
}

.dialog-content {
  margin-top: 1rem;
  color: #555;
}

.dialog-content div {
  margin-bottom: 0.5rem;
}
</style> 