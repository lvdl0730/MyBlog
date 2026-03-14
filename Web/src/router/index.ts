import { createRouter,createWebHistory,type RouteRecordRaw }from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'

import Home from '@/views/Home.vue'
import Articles from "@/views/Articles.vue";
import ArticleDetail from '@/views/ArticleDetail.vue'
import Plans from "@/views/Plans.vue";
import NotFound from '@/views/NotFound.vue'

// 面包屑跳转结构：label显示层级名称 to点击跳转位置
type BreadcrumbItem = {
  label: string
  to?: string
}

const routes:RouteRecordRaw[]= [
    {
        path:'/',
        component:BasicLayout,
        children:[
            {
                path: '',
                name: 'home',
                component:Home,
                meta:{
                  title:'首页',
                  // 首页不显示面包屑
                  hideBreadcrumb:true,
                }
            },
            {
                path: 'articles',
                name: 'articles',
                component:Articles,
                meta:{
                  title:'文章',
                  breadcrumb:[
                    {label:'首页',to:'/'},
                    {label:'文章'}
                  ] satisfies BreadcrumbItem[],
                }
            },

          {
            path: 'detail/:id',
            name: 'article-detail',
            component: ArticleDetail,
            meta: {
              title: '文章详情',
              breadcrumb: [
                { label: '首页', to: '/' },
                { label: '文章', to: '/articles' },
                { label: '文章详情' },
              ],
            },
          },

            {
                path: 'plans',
                name: 'plans',
                component:Plans,
                meta:{
                  title:'计划',
                  breadcrumb:[
                    {label: '首页',to:'/'},
                    {label: '计划'}
                  ] satisfies BreadcrumbItem[],
                }
            }
          // {
          //   path: 'tags',
          //   name: 'tags',
          //   component: () => import('@/views/Tags.vue'),
          //   meta: {
          //     title: '标签',
          //     breadcrumb: [
          //       { label: '首页', to: '/' },
          //       { label: '标签' },
          //     ] satisfies BreadcrumbItem[],
          //   },
          // },

          // {
          //   path: 'tags/:tagSlug',
          //   name: 'tag-articles',
          //   component: () => import('@/views/TagArticles.vue'),
          //   meta: {
          //     title: '标签文章',
          //
          //     /**
          //      * 这里先写一个占位值。
          //      * 以后你可以在详情页里根据 route.params.tagSlug
          //      * 或接口返回结果，把最后一级替换成真实标签名。
          //      */
          //     breadcrumb: [
          //       { label: '首页', to: '/' },
          //       { label: '标签', to: '/tags' },
          //       { label: '标签详情' },
          //     ] satisfies BreadcrumbItem[],
          //   },
          // },

          // {
          //   path: 'help',
          //   name: 'help',
          //   component: () => import('@/views/Help.vue'),
          //   meta: {
          //     title: '帮助',
          //     breadcrumb: [
          //       { label: '首页', to: '/' },
          //       { label: '帮助' },
          //     ] satisfies BreadcrumbItem[],
          //   },
          // },

          // {
          //   path: 'profile',
          //   name: 'profile',
          //   component: () => import('@/views/Profile.vue'),
          //   meta: {
          //     title: '个人中心',
          //     breadcrumb: [
          //       { label: '首页', to: '/' },
          //       { label: '个人中心' },
          //     ] satisfies BreadcrumbItem[],
          //   },
          // },
        ]
    },
    {
        path:'/:pathMatch(.*)*',
        name:'not-found',
        component:NotFound,
      meta:{
          title:'页面不存在',
        hideBreadcrumb:true,
      }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 让浏览器标签名根据meta.title变化
router.afterEach((to)=>{
  const pageTitle=(to.meta.title as string|undefined)??'小夏的博客'
  document.title=`${pageTitle} - 小夏的博客`
})

export default router
