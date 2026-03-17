<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

interface HomeArticleItem {
  id: number
  title: string
  summary: string
  cover: string
  createdAt: string
  wordCount: number
  readingMinutes: number
  tags: string[]
  pinnedRank?: number
  pinnedAt?: string
}

interface CarouselItem {
  id: number
  image: string
  title: string
  desc: string
  articleId?: number
}

const carouselList = ref<CarouselItem[]>([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
    title: '记录博客搭建过程',
    desc: '从布局、文章系统到搜索与编辑器，一步步把博客做完整。',
    articleId: 1,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    title: '整理前端实现思路',
    desc: '把路由、面包屑、页面骨架与内容系统串起来。',
    articleId: 2,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1400&q=80',
    title: '沉淀自己的知识库',
    desc: '让博客不仅能展示项目，也能持续积累内容。',
    articleId: 3,
  },
])

const articles = ref<HomeArticleItem[]>([
  {
    id: 1,
    title: 'Vue3 博客后台布局搭建记录',
    summary: '从 BasicLayout 开始，逐步完成顶部栏、侧边栏、面包屑以及内容区的结构拆分。',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-12',
    wordCount: 3200,
    readingMinutes: 8,
    tags: ['Vue3', 'Ant Design Vue', 'Layout'],
    pinnedRank: 1,
    pinnedAt: '2026-03-12',
  },
  {
    id: 2,
    title: '从零设计个人博客的前端路由结构',
    summary: '梳理首页、文章、计划、标签、详情页的路由分层，并为 breadcrumb 提前设计好 meta 结构。',
    cover: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-09',
    wordCount: 2800,
    readingMinutes: 7,
    tags: ['Router', 'Breadcrumb', '工程化'],
    pinnedRank: 2,
    pinnedAt: '2026-03-09',
  },
  {
    id: 3,
    title: '文章列表页静态版实现',
    summary: '先完成列表页和详情页链路，再逐步升级为更完整的内容系统。',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-06',
    wordCount: 2100,
    readingMinutes: 5,
    tags: ['Articles', 'Mock', 'Frontend'],
    pinnedRank: 3,
    pinnedAt: '2026-03-06',
  },
  {
    id: 4,
    title: 'Pinia 在博客后台中的状态拆分思路',
    summary: '把登录态、UI 状态、内容缓存拆开，避免后期页面越来越多时状态管理混乱。',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-01',
    wordCount: 2500,
    readingMinutes: 6,
    tags: ['Pinia', 'Store', 'State'],
  },
  {
    id: 5,
    title: 'Ant Design Vue 面包屑接入记录',
    summary: '让 breadcrumb 不再写死，而是由 route meta 驱动。',
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-26',
    wordCount: 1800,
    readingMinutes: 4,
    tags: ['Ant Design Vue', 'Breadcrumb'],
  },
  {
    id: 6,
    title: '博客首页卡片区设计草稿',
    summary: '尝试把文章卡片流搬到首页，用作置顶和最新文章聚合区。',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-21',
    wordCount: 1600,
    readingMinutes: 4,
    tags: ['Home', 'UI', 'Card'],
  },
  {
    id: 7,
    title: '标签页路由结构预设计',
    summary: '提前规划 /tags 与 /tags/:tagSlug 两条路由，避免后续返工。',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-15',
    wordCount: 2200,
    readingMinutes: 5,
    tags: ['Tags', 'Router'],
  },
  {
    id: 8,
    title: 'Markdown 编辑器选型对比',
    summary: '围绕 md-editor-v3 和 ByteMD 做对比，准备后续接入图片上传。',
    cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-10',
    wordCount: 3000,
    readingMinutes: 7,
    tags: ['Markdown', 'Editor'],
  },
])

const pinnedArticles = computed(() => {
  return [...articles.value]
    .filter((item) => typeof item.pinnedRank === 'number')
    .sort((a, b) => {
      const rankA = a.pinnedRank ?? Number.MAX_SAFE_INTEGER
      const rankB = b.pinnedRank ?? Number.MAX_SAFE_INTEGER
      return rankA - rankB
    })
    .slice(0, 3)
})

const latestArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const goToArticles = () => {
  router.push('/articles')
}
</script>

<template>
  <div class="home-page">
    <a-card :bordered="false" class="home-page__section">
      <a-carousel autoplay effect="fade" class="home-page__carousel">
        <div
          v-for="item in carouselList"
          :key="item.id"
          class="home-page__carousel-slide"
          @click="item.articleId && goToDetail(item.articleId)"
        >
          <div class="home-page__carousel-bg" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="home-page__carousel-mask">
              <div class="home-page__carousel-content">
                <div class="home-page__carousel-badge">博客首页</div>
                <h2 class="home-page__carousel-title">{{ item.title }}</h2>
                <p class="home-page__carousel-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </a-carousel>
    </a-card>

    <a-card
      :bordered="false"
      class="home-page__section"
      title="置顶文章"
      :body-style="{ padding: '24px' }"
    >
      <div class="home-page__article-list">
        <a-card
          v-for="article in pinnedArticles"
          :key="article.id"
          hoverable
          class="home-page__article-card"
          :bordered="false"
          :body-style="{ padding: '0' }"
          @click="goToDetail(article.id)"
        >
          <div class="home-page__article-shell">
            <div class="home-page__article-cover-wrap">
              <img :src="article.cover" :alt="article.title" class="home-page__article-cover" />
            </div>

            <div class="home-page__article-main">
              <div class="home-page__article-meta">
                <span class="home-page__meta-item">
                  <CalendarOutlined />
                  {{ article.createdAt }}
                </span>
                <span class="home-page__meta-item">
                  <FireOutlined />
                  {{ article.wordCount }} 字
                </span>
                <span class="home-page__meta-item">
                  <ClockCircleOutlined />
                  {{ article.readingMinutes }} 分钟
                </span>
              </div>

              <h3 class="home-page__article-title">{{ article.title }}</h3>
              <p class="home-page__article-summary">{{ article.summary }}</p>

              <div class="home-page__article-footer">
                <div class="home-page__tags">
                  <a-tag v-for="tag in article.tags" :key="tag">
                    <template #icon>
                      <TagOutlined />
                    </template>
                    {{ tag }}
                  </a-tag>
                </div>
                <a-button
                  type="link"
                  class="home-page__article-more"
                  @click.stop="goToDetail(article.id)"
                >
                  more...
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </a-card>

    <a-card
      :bordered="false"
      class="home-page__section"
      title="最新文章"
      :body-style="{ padding: '24px' }"
    >
      <div class="home-page__article-list">
        <a-card
          v-for="article in latestArticles"
          :key="article.id"
          hoverable
          class="home-page__article-card"
          :bordered="false"
          :body-style="{ padding: '0' }"
          @click="goToDetail(article.id)"
        >
          <div class="home-page__article-shell">
            <div class="home-page__article-cover-wrap">
              <img :src="article.cover" :alt="article.title" class="home-page__article-cover" />
            </div>

            <div class="home-page__article-main">
              <div class="home-page__article-meta">
                <span class="home-page__meta-item">
                  <CalendarOutlined />
                  {{ article.createdAt }}
                </span>
                <span class="home-page__meta-item">
                  <FireOutlined />
                  {{ article.wordCount }} 字
                </span>
                <span class="home-page__meta-item">
                  <ClockCircleOutlined />
                  {{ article.readingMinutes }} 分钟
                </span>
              </div>

              <h3 class="home-page__article-title">{{ article.title }}</h3>
              <p class="home-page__article-summary">{{ article.summary }}</p>

              <div class="home-page__article-footer">
                <div class="home-page__tags">
                  <a-tag v-for="tag in article.tags" :key="tag">
                    <template #icon>
                      <TagOutlined />
                    </template>
                    {{ tag }}
                  </a-tag>
                </div>
                <a-button
                  type="link"
                  class="home-page__article-more"
                  @click.stop="goToDetail(article.id)"
                >
                  more...
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <div class="home-page__more-wrap">
        <a-button @click="goToArticles">查看全部文章</a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-page__section {
  border-radius: 16px;
  overflow: hidden;
}

.home-page__carousel {
  border-radius: 16px;
  overflow: hidden;
}

.home-page__carousel-slide {
  cursor: pointer;
}

.home-page__carousel-bg {
  height: 320px;
  background-position: center;
  background-size: cover;
}

.home-page__carousel-mask {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 32px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.56));
}

.home-page__carousel-content {
  max-width: 640px;
  color: #fff;
}

.home-page__carousel-badge {
  display: inline-block;
  margin-bottom: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
}

.home-page__carousel-title {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
}

.home-page__carousel-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.92);
}

.home-page__article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-page__article-card {
  overflow: hidden;
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 0.92));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;
}

.home-page__article-card:hover {
  transform: translateY(-4px);
  border-color: rgba(22, 119, 255, 0.18);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.1);
}

.home-page__article-shell {
  display: grid;
  grid-template-columns: minmax(280px, 38%) minmax(0, 1fr);
  align-items: stretch;
  gap: 28px;
  padding: 24px;
}

.home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-shell {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 38%);
}

.home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-cover-wrap {
  order: 2;
}

.home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-main {
  order: 1;
}

.home-page__article-cover-wrap {
  min-height: 240px;
  border-radius: 18px;
  overflow: hidden;
  background: #f5f5f5;
}

.home-page__article-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.home-page__article-card:hover .home-page__article-cover {
  transform: scale(1.04);
}

.home-page__article-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.home-page__article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.home-page__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.home-page__article-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.35;
  color: #1f1f1f;
  transition: color 0.2s ease;
}

.home-page__article-card:hover .home-page__article-title {
  color: #1677ff;
}

.home-page__article-summary {
  margin: 0 0 18px;
  font-size: 15px;
  line-height: 1.9;
  color: #595959;
}

.home-page__article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
}

.home-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.home-page__article-more {
  padding-inline: 0;
  font-size: 15px;
  font-weight: 600;
}

.home-page__more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .home-page__carousel-bg {
    height: 240px;
  }

  .home-page__carousel-mask {
    padding: 20px;
  }

  .home-page__carousel-title {
    font-size: 24px;
  }

  .home-page__article-shell {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 18px;
  }

  .home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-shell {
    grid-template-columns: 1fr;
  }

  .home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-cover-wrap,
  .home-page__article-list > .home-page__article-card:nth-child(even) .home-page__article-main {
    order: initial;
  }

  .home-page__article-cover-wrap {
    min-height: 200px;
  }

  .home-page__article-title {
    font-size: 22px;
  }

  .home-page__article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
