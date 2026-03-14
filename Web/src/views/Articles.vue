<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'

const router = useRouter()

interface ArticleItem {
  id: number
  title: string
  createdAt: string
}

const articles = ref<ArticleItem[]>([
  { id: 1, title: 'Vue3 博客后台布局搭建记录', createdAt: '2026-02-12' },
  { id: 2, title: '从零设计个人博客的前端路由结构', createdAt: '2026-02-09' },
  { id: 3, title: '文章列表页静态版实现', createdAt: '2026-02-06' },
  { id: 4, title: 'Pinia 在博客后台中的状态拆分思路', createdAt: '2026-01-21' },
  { id: 5, title: 'Ant Design Vue 面包屑接入记录', createdAt: '2026-01-18' },
  { id: 6, title: '博客首页卡片区设计草稿', createdAt: '2026-01-10' },
  { id: 7, title: '标签页路由结构预设计', createdAt: '2025-12-24' },
  { id: 8, title: 'Markdown 编辑器选型对比', createdAt: '2025-12-13' },
])

/**
 * 先写死，后面接 authStore
 */
const isAdmin = ref(true)

const sortedArticles = computed(() => {
  return [...articles.value].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const groupedArticles = computed(() => {
  const map = new Map<
    string,
    {
      year: number
      month: number
      label: string
      items: ArticleItem[]
    }
  >()

  for (const article of sortedArticles.value) {
    const date = new Date(article.createdAt)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${String(month).padStart(2, '0')}`

    if (!map.has(key)) {
      map.set(key, {
        year,
        month,
        label: `${year} 年 / ${String(month).padStart(2, '0')} 月`,
        items: [],
      })
    }

    map.get(key)!.items.push(article)
  }

  return Array.from(map.values())
})

const totalCount = computed(() => articles.value.length)

const goToDetail = (article: ArticleItem) => {
  router.push(`/detail/${article.id}`)
}

const goToCreate = () => {
  router.push('/editor/new')
}

const formatMonthDay = (dateString: string) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}
</script>

<template>
  <div class="articles-page">
    <div class="articles-page__header">
      <div>
        <h2 class="articles-page__title">文章列表</h2>
        <p class="articles-page__desc">目前共计 {{ totalCount }} 篇文章，按月份归档展示。</p>
      </div>

      <a-button v-if="isAdmin" type="primary" @click="goToCreate">
        <template #icon>
          <PlusOutlined />
        </template>
        写文章
      </a-button>
    </div>

    <a-empty v-if="groupedArticles.length === 0" description="暂时还没有文章" />

    <div v-else class="articles-archive">
      <!-- 左侧主轴 -->
      <div class="articles-archive__line"></div>

      <!-- 顶部说明 -->
      <section class="articles-archive__section articles-archive__section--intro">
        <div class="articles-archive__marker">
          <span class="articles-archive__dot articles-archive__dot--intro"></span>
        </div>

        <div class="articles-archive__body">
          <h3 class="articles-archive__intro-title">首页 / 目前共计 {{ totalCount }} 篇文章。</h3>
          <p class="articles-archive__intro-desc">测试阶段</p>
        </div>
      </section>

      <!-- 月份分组 -->
      <section
        v-for="group in groupedArticles"
        :key="`${group.year}-${group.month}`"
        class="articles-archive__section"
      >
        <div class="articles-archive__marker">
          <span class="articles-archive__dot articles-archive__dot--month"></span>
        </div>

        <div class="articles-archive__body">
          <h3 class="articles-archive__group-title">{{ group.label }}</h3>

          <div class="articles-archive__list">
            <button
              v-for="article in group.items"
              :key="article.id"
              type="button"
              class="articles-archive__item"
              @click="goToDetail(article)"
            >
              <span class="articles-archive__date">
                {{ formatMonthDay(article.createdAt) }}
              </span>
              <span class="articles-archive__item-title">
                {{ article.title }}
              </span>
            </button>
          </div>
        </div>
      </section>
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
  margin-bottom: 28px;
}

.articles-page__title {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
  color: #1f1f1f;
}

.articles-page__desc {
  margin: 0;
  font-size: 15px;
  color: #8c8c8c;
}

.articles-archive {
  position: relative;
  padding-left: 8px;
}

.articles-archive__line {
  position: absolute;
  top: 10px;
  bottom: 0;
  left: 23px;
  width: 2px;
  background: #e8e8e8;
}

.articles-archive__section {
  position: relative;
  display: grid;
  grid-template-columns: 32px 1fr;
  column-gap: 24px;
  margin-bottom: 40px;
}

.articles-archive__section--intro {
  margin-bottom: 48px;
}

.articles-archive__marker {
  position: relative;
  min-height: 24px;
}

.articles-archive__dot {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 1;
  border-radius: 50%;
  background: #ffffff;
  box-sizing: border-box;
}

.articles-archive__dot--intro {
  width: 18px;
  height: 18px;
  border: 3px solid #91caff;
}

.articles-archive__dot--month {
  width: 16px;
  height: 16px;
  border: 3px solid #ff85c0;
}

.articles-archive__body {
  min-width: 0;
}

.articles-archive__intro-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  color: #262626;
}

.articles-archive__intro-desc {
  margin: 0;
  font-size: 15px;
  color: #8c8c8c;
}

.articles-archive__group-title {
  margin: 0 0 18px;
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: #262626;
  border-bottom: 1px dashed #e8e8e8;
}

.articles-archive__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.articles-archive__item {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: start;
  column-gap: 12px;
  width: 100%;
  padding: 8px 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.articles-archive__date {
  font-size: 14px;
  line-height: 1.8;
  color: #8c8c8c;
}

.articles-archive__item-title {
  font-size: 18px;
  line-height: 1.8;
  color: #262626;
  transition: color 0.2s ease, transform 0.2s ease;
}

.articles-archive__item:hover .articles-archive__item-title {
  color: #1677ff;
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .articles-page__header {
    flex-direction: column;
    align-items: stretch;
  }

  .articles-page__title {
    font-size: 26px;
  }

  .articles-archive__section {
    grid-template-columns: 28px 1fr;
    column-gap: 16px;
  }

  .articles-archive__item {
    grid-template-columns: 1fr;
    row-gap: 2px;
  }

  .articles-archive__date {
    font-size: 13px;
  }

  .articles-archive__item-title {
    font-size: 16px;
  }
}
</style>
