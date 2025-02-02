<template>
  <div class="bucket-list">
    <div class="bucket-header">
      <div class="header-left">
        <h2>我的存储空间</h2>
        <button class="btn-refresh" title="刷新" @click="refreshBuckets(true)">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <button class="btn-create" @click="openCreateDialog">
        <i class="fas fa-plus"></i> 新建存储空间
      </button>
    </div>

    <div class="buckets-grid">
      <div v-for="bucket in buckets"
           :key="bucket.bucketId"
           :class="{ 'public': bucket.accessPolicy === BucketAccessPolicy.Publish }"
           class="bucket-card">
        <div class="bucket-icon">
          <i class="fas fa-folder-open"></i>
          <span :title="bucket.accessPolicy === BucketAccessPolicy.Publish ? '公开访问' : '私有空间'"
                class="bucket-type">
            <i v-if="bucket.accessPolicy === BucketAccessPolicy.Publish" class="fas fa-users"></i>
            <i v-else class="fas fa-shield-alt"></i>
          </span>
        </div>
        <div class="bucket-info">
          <h3>{{ bucket.name }}</h3>
          <p class="bucket-desc">{{ bucket.desc }}</p>
          <div class="bucket-stats">
            <span><i class="fas fa-database"></i> {{ bucket.usage ? formatSize(bucket.usage) : 0 }}</span>
            <span><i class="fas fa-folder"></i> {{ 0 }}</span>
            <span><i class="fas fa-file"></i> {{ bucket.objectCnt ? bucket.objectCnt : 0 }}</span>
          </div>
          <div class="bucket-dates">
            <span>创建于: {{ timestamp2DateStr(bucket.establishAt) }}</span>
            <span>最后修改: {{ bucket.lastModifiedAt ? timestamp2DateStr(bucket.lastModifiedAt) : "" }}</span>
          </div>
        </div>
        <div class="bucket-actions">
          <div class="secondary-actions">
            <button class="btn-settings" title="设置" @click="openSettings(bucket.bucketId)">
              <i class="fas fa-cog"></i>
            </button>
            <button class="btn-delete" title="删除" @click="deleteBucket(bucket.bucketId,bucket.name)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <button class="btn-enter" title="进入存储空间" @click="enterBucket(bucket.bucketId)">
            <i class="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加创建对话框 -->
    <CreateBucketDialog
        v-model:visible="createDialogVisible"
        @add="handleBucketAdd"
    />

    <!-- 添加确认对话框 -->
    <ConfirmDialog
        v-model:visible="confirmDialogParam.visible"
        :message="confirmDialogParam.message"
        :title="confirmDialogParam.title"
        :type="confirmDialogParam.type"
        @confirm="confirmCallback"
    />

    <BucketSettingsDialog
        v-if="updateBucketData"
        v-model:visible="settingsDialogVisible"
        :bucket="updateBucketData"
        @updated="handleBucketUpdated"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {formatSize} from '@/utils/format'
import CreateBucketDialog from './CreateBucketDialog.vue'
import BucketSettingsDialog from './BucketSettingsDialog.vue'
import ConfirmDialog, {IConfirmDialogParam} from '@/components/common/ConfirmDialog.vue'
import {useRouter} from 'vue-router'
import {
  addBucketInterface,
  BucketAccessPolicy,
  bucketByIdInterface,
  deleteBucketInterface,
  IAddBucketReq,
  IBucket,
  IBucketByIdResp,
  searchBucketsPageInterface,
  updateBucketInterface
} from "@/api/proto/bucketInterface.ts";
import {timestamp2DateStr} from "@/utils/tool.ts";

onMounted(() => {
  refreshBuckets();
})
//列表数据
const buckets = ref<IBucket[]>([])
//新增和修改的模态框
const createDialogVisible = ref(false)
const settingsDialogVisible = ref(false)
//是否打开确认框
const defaultConfirmDialogParam: IConfirmDialogParam = {
  title: "",
  message: "",
  visible: false,
  type: "info"
}
const confirmDialogParam = ref<IConfirmDialogParam>(defaultConfirmDialogParam)

const updateBucketData = ref<IBucketByIdResp>({
  accessPolicy: 0, accessRule: "", bucketId: "", desc: "", establishAt: 0, list: [], name: "", objectCnt: 0, usage: 0
})
const deleteBucketId = ref<string>('')

const router = useRouter()

const openCreateDialog = () => {
  createDialogVisible.value = true
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

const openSettings = async (id: string) => {
  updateBucketData.value = await bucketByIdInterface({bucketId: id})
  settingsDialogVisible.value = true
}

const handleBucketUpdated = (callback: () => void) => {
  if (confirmDialogParam.value.visible) return // 如果正在确认中，不处理新的更新
  confirmDialogParam.value.message = "确定要保存更改吗？"
  confirmDialogParam.value.title = "更新设置"
  confirmDialogParam.value.visible = true
  const stopWatch = watch(confirmDialogParam, (newValue) => {
    if (!newValue.visible) {
      // 执行回调函数
      callback()
      // 取消监听
      stopWatch()
    }
  })
}
const handleBucketAdd = async (data: IAddBucketReq, callback: () => void) => {
  await addBucketInterface(data);
  callback();
  refreshBuckets();
}


const resetConfirmDialogParam = () => {
  confirmDialogParam.value = {...defaultConfirmDialogParam}
}
const confirmCallback = async () => {
  if (deleteBucketId.value != "") {
    try {
      await deleteBucketInterface({
        bucketId: deleteBucketId.value,
      })
      window.$message.success('删除成功')
    } catch (error) {
      window.$message.error('删除失败')
    } finally {
      resetConfirmDialogParam()
      await refreshBuckets();
    }
  } else {
    try {
      await updateBucketInterface({
        accessPolicy: updateBucketData.value.accessPolicy,
        accessRule: updateBucketData.value.accessRule,
        bucketAccount: [],
        bucketId: updateBucketData.value.bucketId,
        desc: updateBucketData.value.desc
      });
      settingsDialogVisible.value = false
      window.$message.success('更新成功')
    } catch (error) {
      window.$message.error(error)
    } finally {
      resetConfirmDialogParam()
      await refreshBuckets();
    }
  }
}

// 删除相关方法
const deleteBucket = (id: string, name: string) => {
  deleteBucketId.value = id
  confirmDialogParam.value.message = `确定要删除存储空间 "${name}" 吗？此操作不可恢复,并且会删除所有子文件和文件夹内容`
  confirmDialogParam.value.title = "删除存储空间"
  confirmDialogParam.value.visible = true
}
const refreshBuckets = async (needNotice?: boolean) => {
  let resp = await searchBucketsPageInterface({});
  buckets.value = [];
  resp.list.forEach((bucket) => {
    buckets.value.push({
      establishAt: bucket.establishAt,
      objectCnt: bucket.objectCnt,
      bucketId: bucket.bucketId,
      lastModifiedAt: bucket.lastModifiedAt,
      name: bucket.name,
      usage: bucket.usage,
      desc: "",
      accessPolicy: bucket.accessPolicy
    })
  })
  if (needNotice) {
    window.$message.success('刷新成功')
  }
}
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
  margin-bottom: 1rem;
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
  display: grid;
  grid-template-columns: repeat(3, 31%); /* 略微减小列宽，留出边距 */
  gap: 2% 3.5%; /* 垂直间距2%，水平间距3.5% */
  height: calc(100% - 60px); /* 减去header和padding的高度 */
  align-content: start;
  margin: 0 auto; /* 居中对齐 */
  width: 100%;
}

.bucket-card {
  background: white;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  aspect-ratio: 3/2; /* 更合适的宽高比 */
  max-height: 100%; /* 确保不超过容器高度 */
}

.bucket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.bucket-icon {
  height: 10%;
  position: relative;
  display: flex;
  align-items: center;
}

.bucket-info {
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.bucket-info h3 {
  font-size: 1.1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bucket-desc {
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--text-light);
}

.bucket-stats {
  height: 30%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: center;
  color: var(--text-light);
  font-size: 0.9rem;
}

.bucket-dates {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: var(--text-light);
  font-size: 0.8rem;
}

.bucket-actions {
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
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

/* 响应式布局 */
@media (max-width: 1400px) {
  .buckets-grid {
    grid-template-columns: repeat(2, 47%); /* 两列时调整宽度和间距 */
    gap: 2% 6%;
  }
}

@media (max-width: 768px) {
  .buckets-grid {
    grid-template-columns: 90%; /* 单列时占90% */
    justify-content: center;
    gap: 1rem;
  }

  .bucket-card {
    aspect-ratio: 2/1; /* 在移动端调整宽高比 */
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-refresh {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-refresh:hover {
  color: var(--primary-color);
  transform: rotate(180deg);
}
</style> 