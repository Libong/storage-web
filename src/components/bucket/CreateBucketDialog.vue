<template>
  <div v-if="visible" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>新建存储空间</h3>
        <button class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="bucket-form">
        <div class="form-item">
          <label>存储空间名称 <span class="required">*</span></label>
          <input 
            v-model="form.name"
            type="text"
            placeholder="请输入3-63个字符，仅支持小写字母、数字和短横线"
            :class="{ 'error': errors.name }"
          >
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
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
          <button type="button" class="btn-cancel" @click="closeDialog">取消</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? '创建中...' : '创建' }}
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
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'created', bucket: Bucket): void
}>()

const form = reactive({
  name: '',
  type: 'private' as 'private' | 'public',
  description: ''
})

const errors = reactive({
  name: ''
})

const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true
  errors.name = ''

  // 验证名称
  if (!form.name) {
    errors.name = '存储空间名称不能为空'
    isValid = false
  } else if (!/^[a-z0-9-]{3,63}$/.test(form.name)) {
    errors.name = '名称只能包含小写字母、数字和短横线，长度3-63个字符'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  try {
    // TODO: 调用创建 bucket 的 API
    // const response = await api.createBucket({
    //   name: form.name,
    //   type: form.type,
    //   description: form.description
    // })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newBucket: Bucket = {
      id: `bucket-${Date.now()}`,
      name: form.name,
      type: form.type,
      description: form.description,
      size: 0,
      folderCount: 0,
      fileCount: 0,
      createTime: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    }

    emit('created', newBucket)
    closeDialog()
    
    window.$message.success('存储空间创建成功')
  } catch (error) {
    // TODO: 根据错误类型显示不同的错误信息
    // if (error.code === 'NAME_EXISTS') {
    //   errors.name = '存储空间名称已存在'
    // } else {
    //   window.$message.error('创建失败，请重试')
    // }
    window.$message.error('创建失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeDialog = () => {
  emit('update:visible', false)
  // 重置表单
  form.name = ''
  form.type = 'private'
  form.description = ''
  errors.name = ''
}

// TODO: 可能需要的其他接口
// - 检查名称是否可用
// - 获取用户配额信息
// - 获取可用区域列表
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
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
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
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
}

.bucket-form {
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

.required {
  color: #ff5252;
  margin-left: 0.25rem;
}

input, textarea {
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  border-color: var(--primary-color);
}

input.error {
  border-color: #ff5252;
}

.error-message {
  color: #ff5252;
  font-size: 0.9rem;
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
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel, .btn-submit {
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
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