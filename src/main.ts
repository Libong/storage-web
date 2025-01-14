import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Message from '@/components/common/Message.vue'

// 创建应用实例
const app = createApp(App)

// 创建全局消息提示实例
const messageInstance = createApp(Message).mount(
  document.createElement('div')
)
document.body.appendChild(messageInstance.$el)

// 添加全局属性
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: typeof messageInstance
  }
}
window.$message = messageInstance

// 使用 Pinia 状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app') 