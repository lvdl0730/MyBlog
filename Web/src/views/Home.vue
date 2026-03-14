<script setup lang="ts">
import { computed,ref } from "vue";
import { useRouter } from "vue-router";
import { PlusOutlined,CalendarOutlined,TagOutlined } from "@ant-design/icons-vue";

const router = useRouter();

// 文章数据类型
interface ArticleItem {
  id: number
  title: string
  summary: string
  cover?: string
  tags: string[]
  createdAt: string
  updatedAt?: string
  isTop?: boolean
}

// 后续替换接口返回的数据
const articles = ref<ArticleItem[]>([
  {
    id: 1,
    title: 'Vue3 博客后台布局搭建记录',
    summary:
      '记录博客后台从基础布局开始的实现过程，包括侧边栏、顶部栏、面包屑以及内容区的结构拆分思路。',
    tags: ['Vue3', 'Ant Design Vue', 'Layout'],
    createdAt: '2026-03-10',
    updatedAt: '2026-03-12',
    isTop: true,
  },
  {
    id: 2,
    title: '从零设计个人博客的前端路由结构',
    summary:
      '整理首页、文章、计划、标签、个人中心等页面的路由分层，并为 breadcrumb 预留统一的 meta 结构。',
    tags: ['Router', 'Vue Router', 'Breadcrumb'],
    createdAt: '2026-03-08',
    updatedAt: '2026-03-09',
  },
  {
    id: 3,
    title: '文章列表页静态版实现',
    summary:
      '先用 mock 数据搭建文章列表页，包括标题、摘要、标签、时间和管理员入口，后续再逐步接入接口与权限控制。',
    tags: ['Articles', 'Mock', 'Frontend'],
    createdAt: '2026-03-06',
  },
])

// 管理员标记，后续接authStore后直接替换掉
const isAdmin = ref(true)

// 排序按照时间倒序
const sortedArticles = computed(() => {
  return [...articles.value].sort((a,b)=>{
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

// 跳转文章详情页
const goToDetail = (article:ArticleItem) => {
  router.push(`/articles/${article.id}`)
}

// 管理员写文章按钮
const goToCreate = ()=>{
  router.push('/editor/new')
}
</script>

<template>
  <div class="articles-page">
    <!-- 页面顶部 -->
    <div class="articles-page__header">
      <!-- 标题+描述 -->
      <div>
        <h2 class="articles-page__title">文章列表</h2>
        <p class="articles-page__desc">这里展示博客文章列表</p>
      </div>

      <!-- 管理员使用的写文章按钮 -->
      <a-button v-if="isAdmin" type="primary" @click="goToCreate">
        <template #icon>
          <PlusOutlined/>
        </template>
        写文章
      </a-button>
    </div>

    <!-- 空状态 -->
    <a-empty v-if="sortedArticles.length===0" description="暂时还没有文章" />

    <!-- 列表 -->
    <div v-else class="articles-page__list">
      <a-card
        v-for="article in sortedArticles"
        :key="article.id"
        class="articles-page__card"
        :bordered="false"
        hoverable
        @click="goToDetail(article)"
      >
        <div class="articles-page__card-inner">
          <div class="articles-page__main">
            <!-- 是否置顶+文章标题 -->
            <div class="articles-page__card-top">
              <a-tag v-if="article.isTop" color="gold">置顶</a-tag>
              <h3 class="articles-page__card-title">
                {{ article.title }}
              </h3>
            </div>

            <!-- 文章总结 -->
            <p class="articles-page__summary">
              {{article.summary}}
            </p>

            <div class="articles-page__meta">
              <!-- 创建时间 -->
              <span class="articles-page__meta-item">
              <CalendarOutlined/>
              <span>创建于 {{ article.createdAt }}</span>
            </span>
              <!-- 最近更新时间 -->
              <span v-if="article.updatedAt" class="articles-page__meta-item">
              <CalendarOutlined/>
              <span>更新于 {{ article.updatedAt }}</span>
            </span>
            </div>

            <!-- 文章标签 -->
            <div class="articles-page__tags">
              <a-tag v-for="tag in article.tags" :key="tag">
                <template #icon>
                  <TagOutlined/>
                </template>
              </a-tag>
            </div>
          </div>
        </div>
      </a-card>

    </div>
  </div>
</template>

<style scoped>
.articles-page {
  width: 100%;
}

.articles-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.articles-page__title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
}

.articles-page__desc {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

.articles-page__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.articles-page__card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.articles-page__card-inner {
  display: flex;
  gap: 16px;
}

.articles-page__main {
  flex: 1;
  min-width: 0;
}

.articles-page__card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.articles-page__card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
}

.articles-page__summary {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.8;
  color: #595959;
}

.articles-page__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.articles-page__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.articles-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 简单适配小屏 */
@media (max-width: 768px) {
  .articles-page__header {
    flex-direction: column;
    align-items: stretch;
  }

  .articles-page__card-title {
    font-size: 18px;
  }
}
</style>
