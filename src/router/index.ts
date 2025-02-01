import {createRouter, createWebHistory} from 'vue-router'
import BucketListView from '@/views/BucketListView.vue'
import BucketDetailView from '@/views/BucketDetailView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Login from '@/loginTemp/login/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/main',
            component: MainLayout,
            children: [
                {
                    path: '',
                    redirect: '/main/buckets'
                },
                {
                    path: 'buckets',
                    name: 'buckets',
                    component: BucketListView
                },
                {
                    path: 'buckets/:id',
                    name: 'BucketDetail',
                    component: BucketDetailView,
                    props: true
                }
            ]
        }
    ]
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token')
//     if (to.path !== '/login' && !token) {
//         next('/login')
//     } else {
//         next()
//     }
// })

export default router 