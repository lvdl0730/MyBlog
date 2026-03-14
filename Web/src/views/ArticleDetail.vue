<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CalendarOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

interface ArticleDetail {
  id: number
  title: string
  summary: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt?: string
}

/**
 * 后面接 authStore 时替换
 */
const isAdmin = ref(true)

const articleMap: Record<number, ArticleDetail> = {
  1: {
    id: 1,
    title: 'Vue3 博客后台布局搭建记录',
    summary: '记录博客后台从基础布局开始的实现过程。',
    content: `
这是文章详情页的占位内容。

你现在已经完成了：
1. BasicLayout 基础骨架
2. 顶部栏和侧边栏
3. 路由 meta + breadcrumb
4. 文章列表归档页

下一步可以继续完善：
- Markdown 渲染
- 目录导航
- 编辑 / 删除按钮
- 详情页标题同步到 breadcrumb
    `.trim(),
    tags: ['Vue3', 'Ant Design Vue', 'Layout'],
    createdAt: '2026-02-12',
    updatedAt: '2026-02-13',
  },
  2: {
    id: 2,
    title: '从零设计个人博客的前端路由结构',
    summary: '整理首页、文章、计划、标签等页面的路由分层。',
    content: `
这是第二篇文章的占位内容。

后面你可以把详情页逐步升级成：
- 根据路由参数请求文章
- 动态更新 breadcrumb 最后一项
- 渲染 markdown 正文
- 支持管理员编辑和删除
    `.trim(),
    tags: ['Router', 'Vue Router', 'Breadcrumb'],
    createdAt: '2026-02-09',
    updatedAt: '2026-02-10',
  },
  3: {
    id: 3,
    title: '文章列表页静态版实现',
    summary: '先用 mock 数据搭建文章列表页。',
    content: `
这是第三篇文章的占位内容。

这一阶段的目标不是把详情页一次做完，
而是先把“列表 -> 详情”的链路跑通。
    `.trim(),
    tags: ['Articles', 'Mock', 'Frontend'],
    createdAt: '2026-02-06',
  },
}

const articleId = computed(() => Number(route.params.id))

const article = computed(() => {
  return articleMap[articleId.value]
})

const goBack = () => {
  router.push('/articles')
}

const goToEdit = () => {
  router.push(`/editor/${articleId.value}`)
}
</script>

<template>
  <div class="article-detail-page">
    <template v-if="article">
      <div class="article-detail-page__toolbar">
        <a-button @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回文章列表
        </a-button>

        <a-button v-if="isAdmin" type="primary" @click="goToEdit">
          <template #icon>
            <EditOutlined />
          </template>
          编辑文章
        </a-button>
      </div>

      <div class="article-detail-page__header">
        <h1 class="article-detail-page__title">
          {{ article.title }}
        </h1>

        <p class="article-detail-page__summary">
          {{ article.summary }}
        </p>

        <div class="article-detail-page__meta">
          <span class="article-detail-page__meta-item">
            <CalendarOutlined />
            <span>创建于 {{ article.createdAt }}</span>
          </span>

          <span v-if="article.updatedAt" class="article-detail-page__meta-item">
            <CalendarOutlined />
            <span>更新于 {{ article.updatedAt }}</span>
          </span>
        </div>

        <div class="article-detail-page__tags">
          <a-tag v-for="tag in article.tags" :key="tag">
            <template #icon>
              <TagOutlined />
            </template>
            {{ tag }}
          </a-tag>
        </div>
      </div>

      <a-divider />

      <div class="article-detail-page__content">
        <pre class="article-detail-page__text">{{ article.content }}</pre>
      </div>
    </template>

    <a-empty v-else description="文章不存在或正在开发中">
      <a-button type="primary" @click="goBack">返回文章列表</a-button>
    </a-empty>
  </div>
</template>

<style scoped>
.article-detail-page {
  width: 100%;
}

.article-detail-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.article-detail-page__header {
  margin-bottom: 20px;
}

.article-detail-page__title {
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 700;
  color: #1f1f1f;
  line-height: 1.4;
}

.article-detail-page__summary {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.8;
  color: #595959;
}

.article-detail-page__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.article-detail-page__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.article-detail-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-detail-page__content {
  font-size: 15px;
  line-height: 1.9;
  color: #262626;
}

.article-detail-page__text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.9;
  color: #262626;
  font-family: inherit;
  background: transparent;
}

@media (max-width: 768px) {
  .article-detail-page__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .article-detail-page__title {
    font-size: 24px;
  }
}
</style>
