<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FireOutlined,
  TagOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { mockArticles } from "@/data/mockArticles.ts";
import { getArticleMarkdown } from "@/data/mockArticleDetails.ts";
import { parseMarkdown } from "@/utils/markdown.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const articleId = computed(() => Number(route.params.id));
const article = computed(() => mockArticles.find((item) => item.id === articleId.value) ?? null);
const markdownContent = computed(() => (article.value ? getArticleMarkdown(article.value) : ""));
const parsedMarkdown = computed(() => parseMarkdown(markdownContent.value));
const activeSectionId = ref("");

let headingObserver: IntersectionObserver | null = null;

const cleanupObserver = () => {
  if (headingObserver) {
    headingObserver.disconnect();
    headingObserver = null;
  }
};

const setupObserver = async () => {
  cleanupObserver();
  if (!parsedMarkdown.value.outline.length) return;
  await nextTick();

  const headings = document.querySelectorAll<HTMLElement>("[data-heading-anchor='true']");
  if (!headings.length) return;

  activeSectionId.value = parsedMarkdown.value.outline[0]?.id ?? "";
  headingObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target instanceof HTMLElement) {
        activeSectionId.value = visible.target.id;
      }
    },
    {
      rootMargin: "-12% 0px -70% 0px",
      threshold: [0.2, 0.45, 0.7],
    },
  );

  headings.forEach((heading) => headingObserver?.observe(heading));
};

watch(parsedMarkdown, setupObserver, { immediate: true });

onBeforeUnmount(() => {
  cleanupObserver();
});

const goBack = () => {
  router.push("/articles");
};

const goToEdit = () => {
  router.push(`/editor/${articleId.value}`);
};

const scrollToHeading = (id: string) => {
  activeSectionId.value = id;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<template>
  <div class="article-detail-page">
    <template v-if="article">
      <div class="article-detail-page__toolbar">
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回文章列表
        </a-button>
        <a-button v-if="authStore.isAdmin" type="primary" @click="goToEdit">
          <template #icon><EditOutlined /></template>
          编辑文章
        </a-button>
      </div>

      <section class="article-hero">
        <div class="article-hero__cover-wrap">
          <img :src="article.cover" :alt="article.title" class="article-hero__cover" />
        </div>
        <div class="article-hero__main">
          <p class="article-hero__eyebrow">Article Detail</p>
          <h1 class="article-hero__title">{{ article.title }}</h1>
          <p class="article-hero__summary">{{ article.summary }}</p>
          <div class="article-hero__meta">
            <span class="article-hero__meta-item"><CalendarOutlined />{{ article.createdAt }}</span>
            <span class="article-hero__meta-item"><FireOutlined />{{ article.wordCount }} 字</span>
            <span class="article-hero__meta-item"><ClockCircleOutlined />{{ article.readingMinutes }} 分钟</span>
          </div>
          <div class="article-hero__tags">
            <a-tag v-for="tag in article.tags" :key="tag">
              <template #icon><TagOutlined /></template>
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </section>

      <div class="article-layout">
        <article class="article-content-card">
          <div class="markdown-body" v-html="parsedMarkdown.html"></div>
        </article>

        <aside class="article-outline-card">
          <div class="article-outline-card__head">
            <span>目录</span>
          </div>
          <nav class="article-outline-card__nav">
            <button
              v-for="item in parsedMarkdown.outline"
              :key="item.id"
              type="button"
              class="article-outline-card__link"
              :class="[`is-level-${item.level}`, { 'is-active': activeSectionId === item.id }]"
              @click="scrollToHeading(item.id)"
            >
              {{ item.title }}
            </button>
          </nav>
        </aside>
      </div>
    </template>

    <a-empty v-else description="文章不存在或仍在准备中">
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

.article-hero {
  display: grid;
  grid-template-columns: minmax(320px, 36%) minmax(0, 1fr);
  gap: 24px;
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #edf1f7;
  border-radius: 26px;
  background: linear-gradient(145deg, #ffffff, #f7fbff);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.05);
}

.article-hero__cover-wrap {
  min-height: 280px;
  border-radius: 20px;
  overflow: hidden;
}

.article-hero__cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-hero__main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.article-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.article-hero__title {
  margin: 0 0 14px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.25;
  color: #1f1f1f;
}

.article-hero__summary {
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #595959;
}

.article-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 18px 0 14px;
}

.article-hero__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.article-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

.article-content-card,
.article-outline-card {
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.04);
}

.article-content-card {
  padding: 34px 40px;
}

.article-outline-card {
  position: sticky;
  top: 96px;
  padding: 18px;
}

.article-outline-card__head {
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f7d7df, #f2b8c6);
  font-size: 14px;
  font-weight: 700;
  color: #7f1d36;
}

.article-outline-card__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.article-outline-card__link {
  padding: 6px 10px;
  border: none;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
  color: #595959;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.article-outline-card__link:hover {
  background: #f5f9ff;
}

.article-outline-card__link.is-active {
  background: #fff1f2;
  color: #cf1322;
}

.article-outline-card__link.is-level-2 {
  padding-left: 22px;
  font-size: 13px;
}

.article-outline-card__link.is-level-3 {
  padding-left: 34px;
  font-size: 13px;
}

:deep(.markdown-body) {
  color: #262626;
  font-size: 16px;
  line-height: 1.95;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin: 0;
  color: #1f1f1f;
  scroll-margin-top: 100px;
}

:deep(.markdown-body h1) {
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 30px;
  line-height: 1.3;
}

:deep(.markdown-body h2) {
  margin-top: 36px;
  margin-bottom: 16px;
  font-size: 24px;
  line-height: 1.35;
}

:deep(.markdown-body h3) {
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: 20px;
  line-height: 1.4;
}

:deep(.markdown-body p) {
  margin: 0;
}

:deep(.markdown-body p + p) {
  margin-top: 14px;
}

:deep(.markdown-body ul) {
  margin: 16px 0;
  padding-left: 22px;
}

:deep(.markdown-body li + li) {
  margin-top: 8px;
}

:deep(.markdown-body pre) {
  margin: 20px 0;
  padding: 18px 20px;
  border-radius: 18px;
  overflow: auto;
  background: #111827;
  color: #f8fafc;
}

:deep(.markdown-body code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: #f5f5f5;
  font-size: 0.92em;
}

:deep(.markdown-body pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

:deep(.markdown-body a) {
  color: #1677ff;
  text-decoration: none;
}

:deep(.markdown-body img) {
  display: block;
  max-width: 100%;
  margin: 20px auto;
  border-radius: 18px;
}

@media (max-width: 1200px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-outline-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-detail-page__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .article-hero {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .article-hero__title {
    font-size: 28px;
  }

  .article-content-card {
    padding: 22px 20px;
  }
}
</style>
