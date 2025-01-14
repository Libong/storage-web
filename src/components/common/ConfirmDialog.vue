<template>
  <div v-if="visible" class="dialog-overlay" @click="cancel">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="cancel">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="dialog-body">
        {{ message }}
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button 
          class="btn-confirm" 
          :class="type"
          @click="confirm"
        >确认</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
  type?: 'warning' | 'danger' | 'info'
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const confirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const cancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dialog-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
}

.dialog-body {
  color: var(--text-color);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.dialog-actions button {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: var(--text-light);
}

.btn-confirm {
  color: white;
}

.btn-confirm.warning {
  background: #e6a23c;
}

.btn-confirm.danger {
  background: #f56c6c;
}

.btn-confirm.info {
  background: var(--primary-color);
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm.warning:hover {
  background: #cf9236;
}

.btn-confirm.danger:hover {
  background: #e04545;
}

.btn-confirm.info:hover {
  background: var(--secondary-color);
}
</style> 