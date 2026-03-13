import { createRouter,createWebHistory }from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'

import Home from '@/views/Home.vue'
import Articles from "@/views/Articles.vue";
import Plans from "@/views/Plans.vue";
import NotFound from '@/views/NotFound.vue'

const routes= [
    {
        path:'/',
        component:BasicLayout,
        children:[
            {
                path: '',
                name: 'home',
                component:Home,
                meta:{title:'首页'}
            },
            {
                path: 'articles',
                name: 'articles',
                component:Articles,
                meta:{title:'文章'}
            },
            {
                path: 'plans',
                name: 'plans',
                component:Plans,
                meta:{title:'计划'}
            }
        ]
    },
    {
        path:'/:pathMatch(.*)*',
        name:'not-found',
        component:NotFound,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router