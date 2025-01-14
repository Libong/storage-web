<template>
  <div class="bucket-list">
    <div class="bucket-header">
      <h2>我的存储空间</h2>
      <button class="btn-create" @click="showCreateDialog">
        <i class="fas fa-plus"></i> 新建存储空间
      </button>
    </div>
    
    <div class="buckets-grid">
      <div v-for="bucket in buckets" 
           :key="bucket.id" 
           class="bucket-card"
           :class="{ 'public': bucket.type === 'public' }">
        <div class="bucket-icon">
          <i class="fas fa-folder-open"></i>
          <span class="bucket-type" :title="bucket.type === 'public' ? '公开访问' : '私有空间'">
            <i v-if="bucket.type === 'public'" class="fas fa-users"></i>
            <i v-else class="fas fa-shield-alt"></i>
          </span>
        </div>
        <div class="bucket-info">
          <h3>{{ bucket.name }}</h3>
          <p class="bucket-desc">{{ bucket.description }}</p>
          <div class="bucket-stats">
            <span><i class="fas fa-database"></i> {{ formatSize(bucket.size) }}</span>
            <span><i class="fas fa-folder"></i> {{ bucket.folderCount }}</span>
            <span><i class="fas fa-file"></i> {{ bucket.fileCount }}</span>
          </div>
          <div class="bucket-dates">
            <span>创建于: {{ bucket.createTime }}</span>
            <span>最后修改: {{ bucket.lastModified }}</span>
          </div>
        </div>
        <div class="bucket-actions">
          <div class="secondary-actions">
            <button @click="openSettings(bucket.id)" class="btn-settings" title="设置">
              <i class="fas fa-cog"></i>
            </button>
            <button @click="deleteBucket(bucket.id)" class="btn-delete" title="删除">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <button @click="enterBucket(bucket.id)" class="btn-enter" title="进入存储空间">
            <i class="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加创建对话框 -->
    <CreateBucketDialog
      v-model:visible="createDialogVisible"
      @created="handleBucketCreated"
    />

    <!-- 添加确认对话框 -->
    <ConfirmDialog
      v-model:visible="deleteConfirmVisible"
      title="删除存储空间"
      :message="deleteConfirmMessage"
      type="danger"
      @confirm="confirmDelete"
    />

    <ConfirmDialog
      v-model:visible="updateConfirmVisible"
      title="更新设置"
      message="确定要保存更改吗？"
      type="info"
      @confirm="confirmUpdate"
    />

    <BucketSettingsDialog
      v-if="selectedBucket"
      v-model:visible="settingsDialogVisible"
      :bucket="selectedBucket"
      :isConfirming="updateConfirmVisible"
      @updated="handleBucketUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatSize } from '@/utils/format'
import CreateBucketDialog from './CreateBucketDialog.vue'
import BucketSettingsDialog from './BucketSettingsDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter } from 'vue-router'

interface Bucket {
  id: string
  name: string
  size: number
  folderCount: number
  fileCount: number
  createTime: string
  lastModified: string
  type: 'private' | 'public'
  description?: string
}

// 模拟数据
const buckets = ref<Bucket[]>([
  {
    id: 'bucket-001',
    name: '个人文档',
    size: 1024 * 1024 * 1024 * 2.5, // 2.5GB
    folderCount: 15,
    fileCount: 128,
    createTime: '2024-01-15',
    lastModified: '2024-03-10',
    type: 'private',
    description: '存储个人的重要文档和资料'
  },
  {
    id: 'bucket-002',
    name: '项目资源',
    size: 1024 * 1024 * 1024 * 8, // 8GB
    folderCount: 25,
    fileCount: 356,
    createTime: '2024-02-01',
    lastModified: '2024-03-15',
    type: 'private',
    description: '工作项目相关的设计资源和文档'
  },
  {
    id: 'bucket-003',
    name: '照片备份',
    size: 1024 * 1024 * 1024 * 15, // 15GB
    folderCount: 48,
    fileCount: 2451,
    createTime: '2024-01-20',
    lastModified: '2024-03-18',
    type: 'private',
    description: '手机和相机照片的自动备份'
  },
  {
    id: 'bucket-004',
    name: '公共资源',
    size: 1024 * 1024 * 1024 * 1.2, // 1.2GB
    folderCount: 8,
    fileCount: 64,
    createTime: '2024-02-15',
    lastModified: '2024-03-12',
    type: 'public',
    description: '可公开访问的共享资源'
  },
  {
    id: 'bucket-005',
    name: '视频素材',
    size: 1024 * 1024 * 1024 * 25, // 25GB
    folderCount: 12,
    fileCount: 186,
    createTime: '2024-02-20',
    lastModified: '2024-03-19',
    type: 'private',
    description: '视频创作的原始素材和成品'
  }
])

const createDialogVisible = ref(false)
const deleteConfirmVisible = ref(false)
const updateConfirmVisible = ref(false)
const settingsDialogVisible = ref(false)
const selectedBucket = ref<Bucket | null>(null)
const bucketToDelete = ref<string>('')

const router = useRouter()

const showCreateDialog = () => {
  createDialogVisible.value = true
}

const handleBucketCreated = (newBucket: Bucket) => {
  buckets.value.unshift(newBucket)
}

// TODO: 从服务端获取 bucket 列表
const fetchBuckets = async () => {
  try {
    // TODO: 调用 API 获取 bucket 列表
    // const response = await api.getBuckets()
    // buckets.value = response.data
  } catch (error) {
    window.$message.error('获取存储空间列表失败')
  }
}

// TODO: 进入 bucket 时需要获取该 bucket 的详细信息和权限
const enterBucket = async (id: string) => {
  try {
    // TODO: 调用 API 获取 bucket 详情和权限
    // const response = await api.getBucketDetails(id)
    router.push(`/buckets/${id}`)
  } catch (error) {
    window.$message.error('进入存储空间失败')
  }
}

// TODO: 打开设置时需要获取 bucket 的配置信息
const openSettings = async (id: string) => {
  try {
    // TODO: 调用 API 获取 bucket 配置
    // const response = await api.getBucketSettings(id)
    selectedBucket.value = buckets.value.find(b => b.id === id) || null
    if (selectedBucket.value) {
      settingsDialogVisible.value = true
    }
  } catch (error) {
    window.$message.error('获取存储空间配置失败')
  }
}

let updatedBucketData: Bucket | null = null

const handleBucketUpdated = (bucket: Bucket) => {
  if (updateConfirmVisible.value) return // 如果正在确认中，不处理新的更新
  updatedBucketData = bucket
  updateConfirmVisible.value = true
}

const confirmUpdate = async () => {
  if (updatedBucketData) {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = buckets.value.findIndex(b => b.id === updatedBucketData!.id)
      if (index !== -1) {
        buckets.value[index] = updatedBucketData
      }
      
      updateConfirmVisible.value = false
      settingsDialogVisible.value = false
      window.$message.success('设置已保存')
      updatedBucketData = null
    } catch (error) {
      updateConfirmVisible.value = false // 出错时也需要关闭确认框
      window.$message.error('保存失败，请重试')
    }
  }
}

// 删除相关方法
const deleteBucket = (id: string) => {
  selectedBucket.value = buckets.value.find(b => b.id === id) || null
  if (selectedBucket.value) {
    bucketToDelete.value = id
    deleteConfirmVisible.value = true
  }
}

const confirmDelete = async () => {
  try {
    // TODO: 调用 API 删除 bucket
    // await api.deleteBucket(bucketToDelete.value)
    buckets.value = buckets.value.filter(bucket => bucket.id !== bucketToDelete.value)
    window.$message.success('删除成功')
  } catch (error) {
    window.$message.error('删除失败')
  }
}

// 计算删除确认消息
const deleteConfirmMessage = computed(() => {
  if (!selectedBucket.value) return ''
  return `确定要删除存储空间 "${selectedBucket.value.name}" 吗？此操作不可恢复。`
})

// 初始化时获取列表
// onMounted(() => {
//   fetchBuckets()
// })
</script>

<style scoped>
.bucket-list {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.bucket-header {
  margin-bottom: 0.5rem;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bucket-header h2 {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
}

.btn-create {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-create:hover {
  background: var(--secondary-color);
}

.buckets-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.8rem;
  overflow: hidden;
}

.bucket-card {
  position: relative;
  background: white;
  border-radius: 0.8rem;
  height: 100%;
  padding: 0.8rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.bucket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.bucket-icon {
  height: 12%;
  display: flex;
  align-items: center;
  font-size: clamp(1.2rem, 2vh, 2rem);
  color: var(--primary-color);
}

.bucket-info {
  height: 76%;
  display: flex;
  flex-direction: column;
}

.bucket-info h3 {
  height: 15%;
  margin: 0;
  display: flex;
  align-items: center;
}

.bucket-desc {
  height: 25%;
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bucket-stats {
  height: 30%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: center;
}

.bucket-dates {
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.bucket-actions {
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.secondary-actions {
  display: flex;
  gap: 1rem;
}

.bucket-actions button {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.btn-enter {
  color: var(--primary-color);
}

.btn-enter:hover {
  color: var(--secondary-color);
  transform: translateX(2px);
}

.btn-settings {
  color: var(--text-light);
}

.btn-settings:hover {
  color: var(--primary-color);
  transform: rotate(30deg);
}

.btn-delete {
  color: var(--text-light);
}

.btn-delete:hover {
  color: #ff5252;
  transform: scale(1.1);
}

.bucket-type {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(92, 107, 192, 0.2);
  transition: transform 0.3s;
}

.bucket-type:hover {
  transform: scale(1.1);
}

.public {
  background: linear-gradient(135deg, rgba(92, 107, 192, 0.1), rgba(92, 107, 192, 0.05));
}

.bucket-actions button i {
  font-size: 1rem;
}

.buckets-grid::-webkit-scrollbar {
  width: 6px;
}

.buckets-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.buckets-grid::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.buckets-grid::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 768px) {
  .bucket-list {
    padding: 1rem;
  }

  .buckets-grid {
    gap: 1rem;
  }

  .bucket-card {
    padding: 1rem;
  }
}

@media screen and (max-height: 800px) {
  .bucket-card {
    gap: 0.5rem;
  }
  
  .bucket-icon {
    margin-bottom: 0.5rem;
  }
  
  .bucket-stats, .bucket-dates {
    font-size: 0.8rem;
  }
  
  .bucket-actions {
    margin-top: 0.5rem;
  }
}

@media screen and (max-height: 600px) {
  .bucket-dates {
    height: 0;
    display: none;
  }
  
  .bucket-info {
    height: 85%;
  }
  
  .bucket-desc {
    height: 35%;
  }
  
  .bucket-stats {
    height: 50%;
  }
}
</style> 