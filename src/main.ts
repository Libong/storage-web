import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Message from '@/components/common/Message.vue'
import "element-plus/dist/index.css";
import "@/loginTemp/login/customCss.scss" //必须全局引用才能被element-plus的customClass发现
//全局引入组件
import {ElNotification} from 'element-plus'
import { ComponentPublicInstance } from 'vue'

// 创建应用实例
const app = createApp(App)

// 创建全局消息提示实例
const messageInstance = createApp(Message).mount(
    document.createElement('div')
) as ComponentPublicInstance<typeof Message>
document.body.appendChild(messageInstance.$el)

// 添加全局属性
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: ComponentPublicInstance<typeof Message>
    }
}
window.$message = messageInstance

// 使用 Pinia 状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 设置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
    console.error("Global error handler:", err, vm, info);
    let message;
    if (err instanceof Error) {
        message = err.message
    } else if (typeof err == "string") {
        message = err
    }
    ElNotification({
        title: "",
        message: message,
        duration: 2000,
    });
    return true;
};
// 在全局范围内捕获未处理的Promise错误reject
window.onunhandledrejection = (event) => {
    console.error('Unhandled Rejection:', event.promise, 'reason:', event.reason);
    event.preventDefault();
    //TODO 说是window比app挂载快会导致app.config.errorHandler为null 但是没找到解决方法
    if (app.config.errorHandler != null) {
        app.config.errorHandler(event.reason, null, "Unhandled Rejection");
    }
};