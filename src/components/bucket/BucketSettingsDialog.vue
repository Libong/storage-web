<template>
  <div v-if="visible" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>存储空间设置</h3>
        <button class="close-btn" @click="closeDialog" :disabled="isSubmitting">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="settings-form">
        <div class="form-item">
          <label>存储空间名称</label>
          <input 
            v-model="form.name"
            type="text"
            disabled
          >
        </div>

        <div class="form-item">
          <label>访问权限</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="form.type" 
                value="private"
              > 私有
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="form.type" 
                value="public"
              > 公开
            </label>
          </div>
        </div>

        <div class="form-item">
          <label>描述</label>
          <textarea 
            v-model="form.description"
            placeholder="请输入存储空间描述信息"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="btn-cancel" 
            @click="closeDialog"
            :disabled="isSubmitting"
          >取消</button>
          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="isSubmitting || isConfirming"
          >
            {{ isSubmitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Bucket } from '@/types/bucket'

const props = defineProps<{
  visible: boolean
  bucket: Bucket
  isConfirming?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'updated', bucket: Bucket): void
}>()

interface SettingsForm {
  name: string
  type: 'private' | 'public'
  description: string
}

const form = reactive<SettingsForm>({
  name: '',
  type: 'private',
  description: ''
})

const isSubmitting = ref(false)

// 监听 bucket 属性变化，更新表单
if (props.bucket) {
  form.name = props.bucket.name
  form.type = props.bucket.type
  form.description = props.bucket.description || ''
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    const updatedBucket: Bucket = {
      ...props.bucket,
      type: form.type,
      description: form.description
    }

    emit('updated', updatedBucket)
  } catch (error) {
    window.$message.error('保存失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeDialog = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
/* 对话框基础样式 */
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
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dialog-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--text-color);
}

.close-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 表单样式 */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item label {
  color: var(--text-color);
  font-weight: 500;
}

input, textarea {
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s;
  font-size: 0.95rem;
}

input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

input:focus, textarea:focus {
  border-color: var(--primary-color);
}

.radio-group {
  display: flex;
  gap: 2rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel, .btn-submit {
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-cancel {
  background: #f5f5f5;
  color: var(--text-light);
}

.btn-submit {
  background: var(--primary-color);
  color: white;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit:not(:disabled):hover {
  background: var(--secondary-color);
}
</style> 