<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RocketOutlined,
  TagOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { mockArticles, mockCarouselList } from "@/data/mockArticles.ts";

const router = useRouter();
const authStore = useAuthStore();

const pinnedArticles = computed(() => {
  return [...mockArticles]
    .filter((item) => typeof item.pinnedRank === "number")
    .sort((a, b) => (a.pinnedRank ?? Number.MAX_SAFE_INTEGER) - (b.pinnedRank ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 3);
});

const latestArticles = computed(() => {
  return [...mockArticles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const totalWords = computed(() => mockArticles.reduce((sum, item) => sum + item.wordCount, 0));
const totalTags = computed(() => new Set(mockArticles.flatMap((item) => item.tags)).size);

const roadmapSnapshot = [
  "内容系统主链路：首页、文章列表、详情页、标签页继续补齐。",
  "编辑器与资源上传：准备接入 Markdown 编辑器和图片上传适配器。",
  "计划与搜索：计划模块做 CRUD，搜索浮层对齐参考交互。",
];

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`);
};

const goToArticles = () => {
  router.push("/articles");
};

const goToPlans = () => {
  router.push("/plans");
};

const enterAdminMode = () => {
  router.push("/auth/login?redirect=/plans");
};
</script>

<template>
  <div class="home-page">
    <section class="home-page__hero">
      <a-card :bordered="false" class="home-page__hero-carousel">
        <a-carousel autoplay effect="fade" class="home-page__carousel">
          <div
            v-for="item in mockCarouselList"
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

      <aside class="home-page__hero-side">
        <div class="home-page__side-card">
          <p class="home-page__side-eyebrow">执行快照</p>
          <h3 class="home-page__side-title">当前博客前端正在推进的三件事</h3>
          <ul class="home-page__snapshot-list">
            <li v-for="item in roadmapSnapshot" :key="item">{{ item }}</li>
          </ul>
          <div class="home-page__side-actions">
            <a-button type="primary" @click="goToPlans">
              <template #icon>
                <RocketOutlined />
              </template>
              查看计划页
            </a-button>
            <a-button @click="goToArticles">查看文章列表</a-button>
          </div>
        </div>

        <div class="home-page__side-card home-page__side-card--soft">
          <div class="home-page__identity">
            <div>
              <p class="home-page__identity-label">当前身份</p>
              <strong class="home-page__identity-value">
                {{ authStore.isAdmin ? "管理员模式" : authStore.isLogin ? "用户模式" : "游客模式" }}
              </strong>
            </div>
            <a-button v-if="!authStore.isLogin" size="small" @click="enterAdminMode">
              进入管理员模式
            </a-button>
          </div>
          <p class="home-page__identity-desc">
            管理员模式下可以更方便地体验计划页新增计划、文章写作入口和后续的内容管理能力。
          </p>
        </div>
      </aside>
    </section>

    <section class="home-page__overview">
      <article class="home-page__metric-card">
        <span class="home-page__metric-label">文章总数</span>
        <strong class="home-page__metric-value">{{ mockArticles.length }}</strong>
        <span class="home-page__metric-note">当前用于首页和列表页展示的内容集合</span>
      </article>
      <article class="home-page__metric-card">
        <span class="home-page__metric-label">累计字数</span>
        <strong class="home-page__metric-value">{{ totalWords }}</strong>
        <span class="home-page__metric-note">以当前 mock 内容估算的前端知识沉淀</span>
      </article>
      <article class="home-page__metric-card">
        <span class="home-page__metric-label">标签覆盖</span>
        <strong class="home-page__metric-value">{{ totalTags }}</strong>
        <span class="home-page__metric-note">覆盖布局、路由、状态、编辑器等主题</span>
      </article>
    </section>

    <section class="home-page__section">
      <div class="home-page__section-head">
        <div>
          <p class="home-page__section-eyebrow">Pinned Articles</p>
          <h3 class="home-page__section-title">置顶文章</h3>
        </div>
        <a-button type="link" @click="goToArticles">查看全部文章</a-button>
      </div>

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

              <h4 class="home-page__article-title">{{ article.title }}</h4>
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
                <a-button type="link" class="home-page__article-more" @click.stop="goToDetail(article.id)">
                  more...
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </section>

    <section class="home-page__section home-page__section--latest">
      <div class="home-page__section-head">
        <div>
          <p class="home-page__section-eyebrow">Latest Notes</p>
          <h3 class="home-page__section-title">最新文章</h3>
        </div>
        <a-button @click="goToArticles">进入时间轴归档</a-button>
      </div>

      <div class="home-page__latest-grid">
        <button
          v-for="article in latestArticles"
          :key="article.id"
          type="button"
          class="home-page__latest-item"
          @click="goToDetail(article.id)"
        >
          <span class="home-page__latest-date">{{ article.createdAt }}</span>
          <span class="home-page__latest-title">{{ article.title }}</span>
          <span class="home-page__latest-summary">{{ article.summary }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.home-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.85fr);
  gap: 18px;
}

.home-page__hero-carousel,
.home-page__side-card,
.home-page__section,
.home-page__metric-card {
  border-radius: 24px;
  overflow: hidden;
}

.home-page__carousel {
  border-radius: 24px;
  overflow: hidden;
}

.home-page__carousel-slide {
  cursor: pointer;
}

.home-page__carousel-bg {
  height: 360px;
  background-position: center;
  background-size: cover;
}

.home-page__carousel-mask {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 32px;
  background: linear-gradient(180deg, rgba(7, 18, 39, 0.14), rgba(7, 18, 39, 0.66));
}

.home-page__carousel-content {
  max-width: 620px;
  color: #ffffff;
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
  font-size: 34px;
  font-weight: 700;
  line-height: 1.28;
}

.home-page__carousel-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.92);
}

.home-page__hero-side {
  display: grid;
  gap: 18px;
}

.home-page__side-card {
  padding: 24px;
  border: 1px solid #edf1f7;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.home-page__side-card--soft {
  background: linear-gradient(145deg, #f9fbff, #ffffff);
}

.home-page__side-eyebrow,
.home-page__section-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.home-page__side-title,
.home-page__section-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  color: #1f1f1f;
}

.home-page__snapshot-list {
  margin: 16px 0 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.9;
  color: #595959;
}

.home-page__side-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.home-page__identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.home-page__identity-label {
  margin: 0 0 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.home-page__identity-value {
  font-size: 18px;
  color: #1f1f1f;
}

.home-page__identity-desc {
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: #595959;
}

.home-page__overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.home-page__metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.04);
}

.home-page__metric-label {
  font-size: 13px;
  color: #8c8c8c;
}

.home-page__metric-value {
  font-size: 30px;
  font-weight: 700;
  color: #1f1f1f;
}

.home-page__metric-note {
  font-size: 13px;
  line-height: 1.7;
  color: #8c8c8c;
}

.home-page__section {
  padding: 24px;
  border: 1px solid #edf1f7;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.04);
}

.home-page__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
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
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.home-page__article-card:hover {
  transform: translateY(-4px);
  border-color: rgba(22, 119, 255, 0.18);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.1);
}

.home-page__article-shell {
  display: grid;
  grid-template-columns: minmax(280px, 38%) minmax(0, 1fr);
  gap: 26px;
  padding: 24px;
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

.home-page__latest-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.home-page__latest-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px;
  border: 1px solid #edf1f7;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f9fbff);
  text-align: left;
  cursor: pointer;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.home-page__latest-item:hover {
  transform: translateY(-2px);
  border-color: rgba(22, 119, 255, 0.18);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
}

.home-page__latest-date {
  font-size: 13px;
  color: #8c8c8c;
}

.home-page__latest-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: #1f1f1f;
}

.home-page__latest-summary {
  font-size: 14px;
  line-height: 1.8;
  color: #595959;
}

@media (max-width: 1200px) {
  .home-page__hero {
    grid-template-columns: 1fr;
  }

  .home-page__overview,
  .home-page__latest-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .home-page__carousel-bg {
    height: 260px;
  }

  .home-page__carousel-mask,
  .home-page__section,
  .home-page__side-card,
  .home-page__metric-card {
    padding: 20px;
  }

  .home-page__carousel-title {
    font-size: 26px;
  }

  .home-page__overview,
  .home-page__latest-grid {
    grid-template-columns: 1fr;
  }

  .home-page__section-head,
  .home-page__identity,
  .home-page__article-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .home-page__article-shell {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 18px;
  }

  .home-page__article-cover-wrap {
    min-height: 200px;
  }

  .home-page__article-title {
    font-size: 22px;
  }
}
</style>
