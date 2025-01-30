import {createRouter, createWebHistory} from 'vue-router'
import BucketListView from '@/views/BucketListView.vue'
import BucketDetailView from '@/views/BucketDetailView.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: "/",
        //     redirect: "/login",
        // },
        // {
        //     path: "/login",
        //     name: "Login",
        //     component: Login,
        // },
        {
            path: '/',
            component: MainLayout,
            children: [
                {
                    path: '',
                    redirect: '/buckets'
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

export default router 