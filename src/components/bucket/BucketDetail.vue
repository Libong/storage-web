<template>
  <div class="bucket-detail">
    <div class="bucket-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>{{ bucket?.name }}</h2>
        <span class="bucket-type" :class="bucket?.type">
          {{ bucket?.type === 'public' ? '公开' : '私有' }}
        </span>
      </div>
      <div class="header-actions">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
        <button class="btn-upload" @click="triggerFileUpload">
          <i class="fas fa-upload"></i> 上传
        </button>
        <button class="btn-new-folder">
          <i class="fas fa-folder-plus"></i> 新建文件夹
        </button>
      </div>
    </div>

    <div class="bucket-content">
      <div class="path-nav">
        <button class="path-item" @click="navigateTo([])">
          <i class="fas fa-home"></i>
        </button>
        <template v-for="(segment, index) in currentPath" :key="index">
          <i class="fas fa-chevron-right separator"></i>
          <button 
            class="path-item"
            @click="navigateTo(currentPath.slice(0, index + 1))"
          >{{ segment }}</button>
        </template>
      </div>

      <div class="content-table">
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>大小</th>
              <th>修改时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentItems" :key="item.id" @click="handleItemClick(item)" :class="{ 'is-folder': item.isFolder }">
              <td class="name-cell">
                <i :class="getItemIcon(item)"></i>
                <span>{{ item.name }}</span>
              </td>
              <td>{{ formatSize(item.size) }}</td>
              <td>{{ item.modifiedTime }}</td>
              <td class="actions-cell" @click.stop>
                <button class="btn-action" title="下载" v-if="!item.isFolder">
                  <i class="fas fa-download"></i>
                </button>
                <button class="btn-action" title="分享">
                  <i class="fas fa-share-alt"></i>
                </button>
                <button class="btn-action" title="删除">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatSize } from '@/utils/format'

interface BucketItem {
  id: string
  name: string
  size: number
  modifiedTime: string
  isFolder: boolean
  type?: string
}

interface BucketInfo {
  id: string
  name: string
  type: 'private' | 'public'
}

const props = defineProps<{
  bucketId: string
}>()

const router = useRouter()
const currentPath = ref<string[]>([])
const bucket = ref<BucketInfo | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 模拟数据结构
const mockData = {
  'root': [
    {
      id: '1',
      name: '文档',
      size: 0,
      modifiedTime: '2024-03-20',
      isFolder: true
    },
    {
      id: '2',
      name: '图片素材',
      size: 0,
      modifiedTime: '2024-03-19',
      isFolder: true
    },
    {
      id: '3',
      name: '项目文件',
      size: 0,
      modifiedTime: '2024-03-18',
      isFolder: true
    },
    {
      id: '4',
      name: '测试文件.pdf',
      size: 1024 * 1024 * 2.5,
      modifiedTime: '2024-03-19',
      isFolder: false,
      type: 'pdf'
    }
  ],
  'root/文档': [
    {
      id: '5',
      name: '工作',
      size: 0,
      modifiedTime: '2024-03-17',
      isFolder: true
    },
    {
      id: '6',
      name: '个人',
      size: 0,
      modifiedTime: '2024-03-16',
      isFolder: true
    },
    {
      id: '7',
      name: '项目计划.docx',
      size: 1024 * 512,
      modifiedTime: '2024-03-18',
      isFolder: false,
      type: 'docx'
    }
  ],
  'root/文档/工作': [
    {
      id: '8',
      name: '会议记录',
      size: 0,
      modifiedTime: '2024-03-15',
      isFolder: true
    },
    {
      id: '9',
      name: '2024年计划.xlsx',
      size: 1024 * 256,
      modifiedTime: '2024-03-14',
      isFolder: false,
      type: 'xlsx'
    }
  ],
  'root/文档/工作/会议记录': [
    {
      id: '10',
      name: '3月产品评审.docx',
      size: 1024 * 128,
      modifiedTime: '2024-03-13',
      isFolder: false,
      type: 'docx'
    },
    {
      id: '11',
      name: '团队周会纪要.pdf',
      size: 1024 * 64,
      modifiedTime: '2024-03-12',
      isFolder: false,
      type: 'pdf'
    }
  ],
  'root/图片素材': [
    {
      id: '12',
      name: '产品展示',
      size: 0,
      modifiedTime: '2024-03-11',
      isFolder: true
    },
    {
      id: '13',
      name: 'banner设计.psd',
      size: 1024 * 1024 * 15,
      modifiedTime: '2024-03-10',
      isFolder: false,
      type: 'psd'
    },
    {
      id: '14',
      name: 'logo.png',
      size: 1024 * 512,
      modifiedTime: '2024-03-09',
      isFolder: false,
      type: 'png'
    }
  ],
  'root/图片素材/产品展示': [
    {
      id: '15',
      name: '主图.jpg',
      size: 1024 * 1024 * 2,
      modifiedTime: '2024-03-08',
      isFolder: false,
      type: 'jpg'
    },
    {
      id: '16',
      name: '细节图',
      size: 0,
      modifiedTime: '2024-03-07',
      isFolder: true
    }
  ],
  'root/项目文件': [
    {
      id: '17',
      name: '源代码',
      size: 0,
      modifiedTime: '2024-03-06',
      isFolder: true
    },
    {
      id: '18',
      name: '设计稿',
      size: 0,
      modifiedTime: '2024-03-05',
      isFolder: true
    },
    {
      id: '19',
      name: 'README.md',
      size: 1024 * 2,
      modifiedTime: '2024-03-04',
      isFolder: false,
      type: 'md'
    }
  ]
}

const currentItems = ref<BucketItem[]>([])

onMounted(() => {
  // 模拟获取 bucket 信息
  bucket.value = {
    id: props.bucketId,
    name: '个人文档',
    type: 'private'
  }
  // 初始化根目录内容
  loadContent([])
})

const loadContent = (path: string[]) => {
  const pathKey = path.length === 0 ? 'root' : `root/${path.join('/')}`
  currentItems.value = [...(mockData[pathKey] || [])]
}

const navigateTo = (path: string[]) => {
  currentPath.value = path
  loadContent(path)
}

const handleItemClick = (item: BucketItem) => {
  if (item.isFolder) {
    const newPath = [...currentPath.value, item.name]
    navigateTo(newPath)
  }
}

const goBack = () => {
  if (currentPath.value.length > 0) {
    navigateTo(currentPath.value.slice(0, -1))
  } else {
    router.push('/buckets')
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]
  const newItem: BucketItem = {
    id: `file-${Date.now()}`,
    name: file.name,
    size: file.size,
    modifiedTime: new Date().toISOString().split('T')[0],
    isFolder: false,
    type: file.name.split('.').pop()
  }

  // 模拟上传并添加到当前路径
  const pathKey = currentPath.value.length === 0 ? 'root' : `root/${currentPath.value.join('/')}`
  if (!mockData[pathKey]) {
    mockData[pathKey] = []
  }
  mockData[pathKey].push(newItem)
  loadContent(currentPath.value) // 确保刷新当前目录

  window.$message.success(`文件 "${file.name}" 上传成功`)
}

const getItemIcon = (item: BucketItem) => {
  if (item.isFolder) return 'fas fa-folder'
  
  // 根据文件类型返回不同图标
  const iconMap: Record<string, string> = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    xls: 'fas fa-file-excel',
    xlsx: 'fas fa-file-excel',
    jpg: 'fas fa-file-image',
    jpeg: 'fas fa-file-image',
    png: 'fas fa-file-image',
    mp4: 'fas fa-file-video',
    mp3: 'fas fa-file-audio'
  }

  const ext = item.type || ''
  return iconMap[ext] || 'fas fa-file'
}
</script>

<style scoped>
.bucket-detail {
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

.bucket-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.path-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.5rem;
}

.content-table {
  flex: 1;
  background: white;
  border-radius: 0.5rem;
  overflow: auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.btn-back:hover {
  color: var(--primary-color);
}

.bucket-type {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.bucket-type.public {
  background: #e3f2fd;
  color: #1976d2;
}

.bucket-type.private {
  background: #fafafa;
  color: #616161;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.header-actions button {
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-upload {
  background: var(--primary-color);
  color: white;
}

.btn-upload:hover {
  background: var(--secondary-color);
}

.btn-new-folder {
  background: #f5f5f5;
  color: var(--text-color);
}

.btn-new-folder:hover {
  background: #e0e0e0;
}

.path-item {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
  transition: color 0.3s;
}

.path-item:hover {
  color: var(--primary-color);
}

.separator {
  color: var(--text-light);
  font-size: 0.8rem;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name-cell i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.actions-cell {
  display: flex;
  gap: 1rem;
}

.btn-action {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  color: var(--primary-color);
  transform: scale(1.1);
}

tr.is-folder {
  cursor: pointer;
}

tr.is-folder:hover {
  background: rgba(92, 107, 192, 0.05);
}

/* 确保表格内容正确对齐 */
th, td {
  padding: 0.8rem 1rem;
  text-align: left;
}

th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 500;
  color: var(--text-color);
}

/* 确保表格列宽合理分配 */
table {
  width: 100%;
  border-collapse: collapse;
}

td:nth-child(1) { width: 40%; } /* 名称列 */
td:nth-child(2) { width: 15%; } /* 大小列 */
td:nth-child(3) { width: 25%; } /* 修改时间列 */
td:nth-child(4) { width: 20%; } /* 操作列 */
</style> 