<template>
  <div class="key-info-dialog" @click.stop>
    <div class="dialog-header">
      <h3>密钥信息</h3>
      <button class="close-btn" @click="closeDialog">
        <i class="fas fa-times"></i>
      </button>
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
}>();
</script>

<style scoped>
.key-info-dialog {
  position: absolute; /* 绝对定位 */
  top: 10%; /* 距离顶部10% */
  right: 10%; /* 距离右侧10% */
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

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
}

.dialog-content {
  margin-top: 1rem;
  color: #555;
}

.dialog-content div {
  margin-bottom: 0.5rem;
}
</style> 