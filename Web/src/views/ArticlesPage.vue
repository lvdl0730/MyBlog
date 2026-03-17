<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { mockArticles } from "@/data/mockArticles.ts";

type ArticleItem = (typeof mockArticles)[number];

const router = useRouter();
const authStore = useAuthStore();
const keyword = ref("");

const sortedArticles = computed(() => {
  return [...mockArticles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
});

const filteredArticles = computed(() => {
  const query = keyword.value.trim().toLowerCase();
  if (!query) {
    return sortedArticles.value;
  }

  return sortedArticles.value.filter((article) => {
    const haystack = [article.title, article.summary, ...article.tags].join(" ").toLowerCase();
    return haystack.includes(query);
  });
});

const groupedArticles = computed(() => {
  const map = new Map<
    string,
      {
        year: number;
        month: number;
        label: string;
        count: number;
        items: ArticleItem[];
      }
  >();

  for (const article of filteredArticles.value) {
    const date = new Date(article.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, {
        year,
        month,
        label: `${year} / ${String(month).padStart(2, "0")}`,
        count: 0,
        items: [],
      });
    }

    const group = map.get(key)!;
    group.items.push(article);
    group.count += 1;
  }

  return Array.from(map.values());
});

const latestArticle = computed(() => filteredArticles.value[0] ?? sortedArticles.value[0] ?? null);
const totalCount = computed(() => filteredArticles.value.length);
const pinnedCount = computed(
  () => filteredArticles.value.filter((item) => typeof item.pinnedRank === "number").length,
);
const uniqueTagCount = computed(() => new Set(filteredArticles.value.flatMap((item) => item.tags)).size);

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`);
};

const goToCreate = () => {
  router.push("/editor/new");
};

const clearSearch = () => {
  keyword.value = "";
};

const formatMonthDay = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};
</script>

<template>
  <div class="articles-page">
    <section class="articles-page__hero">
      <div>
        <p class="articles-page__eyebrow">Archive Timeline</p>
        <h2 class="articles-page__title">文章列表</h2>
        <p class="articles-page__desc">
          这里继续保留时间轴归档结构，但补了搜索、概览卡片和最新文章摘要，让页面在查找内容时更顺手。
        </p>
      </div>

      <div class="articles-page__hero-actions">
        <a-button v-if="authStore.isAdmin" type="primary" @click="goToCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          写文章
        </a-button>
      </div>
    </section>

    <section class="articles-page__toolbar">
      <div class="articles-page__search">
        <SearchOutlined class="articles-page__search-icon" />
        <input
          v-model="keyword"
          class="articles-page__search-input"
          type="text"
          placeholder="搜索文章标题、摘要或标签"
        />
        <button v-if="keyword" type="button" class="articles-page__search-clear" @click="clearSearch">
          清空
        </button>
      </div>

      <div class="articles-page__metrics">
        <article class="articles-page__metric-card">
          <span class="articles-page__metric-label">当前结果</span>
          <strong class="articles-page__metric-value">{{ totalCount }}</strong>
        </article>
        <article class="articles-page__metric-card">
          <span class="articles-page__metric-label">置顶文章</span>
          <strong class="articles-page__metric-value">{{ pinnedCount }}</strong>
        </article>
        <article class="articles-page__metric-card">
          <span class="articles-page__metric-label">标签覆盖</span>
          <strong class="articles-page__metric-value">{{ uniqueTagCount }}</strong>
        </article>
      </div>
    </section>

    <section v-if="latestArticle" class="articles-feature">
      <div class="articles-feature__cover-wrap">
        <img :src="latestArticle.cover" :alt="latestArticle.title" class="articles-feature__cover" />
      </div>

      <div class="articles-feature__content">
        <p class="articles-feature__eyebrow">最新更新</p>
        <h3 class="articles-feature__title">{{ latestArticle.title }}</h3>
        <p class="articles-feature__summary">{{ latestArticle.summary }}</p>

        <div class="articles-feature__meta">
          <span class="articles-feature__meta-item">
            <CalendarOutlined />
            {{ latestArticle.createdAt }}
          </span>
          <span class="articles-feature__meta-item">
            <FireOutlined />
            {{ latestArticle.wordCount }} 字
          </span>
          <span class="articles-feature__meta-item">
            <ClockCircleOutlined />
            {{ latestArticle.readingMinutes }} 分钟
          </span>
        </div>

        <div class="articles-feature__tags">
          <a-tag v-for="tag in latestArticle.tags" :key="tag">
            <template #icon>
              <TagOutlined />
            </template>
            {{ tag }}
          </a-tag>
        </div>

        <a-button type="primary" @click="goToDetail(latestArticle.id)">进入详情</a-button>
      </div>
    </section>

    <a-empty v-if="groupedArticles.length === 0" description="没有找到匹配的文章" />

    <div v-else class="articles-archive">
      <div class="articles-archive__line"></div>

      <section class="articles-archive__section articles-archive__section--intro">
        <div class="articles-archive__marker">
          <span class="articles-archive__dot articles-archive__dot--intro"></span>
        </div>

        <div class="articles-archive__body">
          <h3 class="articles-archive__intro-title">按月份回看前端搭建过程</h3>
          <p class="articles-archive__intro-desc">
            当前共展示 {{ totalCount }} 篇文章，搜索会同时匹配标题、摘要和标签。
          </p>
        </div>
      </section>

      <section
        v-for="group in groupedArticles"
        :key="`${group.year}-${group.month}`"
        class="articles-archive__section"
      >
        <div class="articles-archive__marker">
          <span class="articles-archive__dot articles-archive__dot--month"></span>
        </div>

        <div class="articles-archive__body">
          <div class="articles-archive__group-head">
            <h3 class="articles-archive__group-title">{{ group.label }}</h3>
            <span class="articles-archive__group-count">{{ group.count }} 篇</span>
          </div>

          <div class="articles-archive__list">
            <button
              v-for="article in group.items"
              :key="article.id"
              type="button"
              class="articles-archive__item"
              @click="goToDetail(article.id)"
            >
              <div class="articles-archive__item-date">{{ formatMonthDay(article.createdAt) }}</div>
              <div class="articles-archive__item-main">
                <div class="articles-archive__item-head">
                  <span class="articles-archive__item-title">{{ article.title }}</span>
                  <span class="articles-archive__item-read">{{ article.readingMinutes }} 分钟</span>
                </div>
                <p class="articles-archive__item-summary">{{ article.summary }}</p>
                <div class="articles-archive__item-tags">
                  <a-tag v-for="tag in article.tags" :key="tag">{{ tag }}</a-tag>
                </div>
              </div>
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

.articles-page__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.articles-page__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.articles-page__title {
  margin: 0 0 10px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.22;
  color: #1f1f1f;
}

.articles-page__desc {
  max-width: 760px;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #8c8c8c;
}

.articles-page__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 16px;
  margin-bottom: 24px;
}

.articles-page__search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.articles-page__search-icon {
  color: #8c8c8c;
}

.articles-page__search-input {
  flex: 1;
  height: 52px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
}

.articles-page__search-clear {
  border: none;
  background: transparent;
  color: #1677ff;
  cursor: pointer;
}

.articles-page__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.articles-page__metric-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.articles-page__metric-label {
  font-size: 12px;
  color: #8c8c8c;
}

.articles-page__metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
}

.articles-feature {
  display: grid;
  grid-template-columns: minmax(280px, 38%) minmax(0, 1fr);
  gap: 24px;
  margin-bottom: 28px;
  padding: 22px;
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.articles-feature__cover-wrap {
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
}

.articles-feature__cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.articles-feature__content {
  display: flex;
  flex-direction: column;
}

.articles-feature__eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.articles-feature__title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.34;
  color: #1f1f1f;
}

.articles-feature__summary {
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #595959;
}

.articles-feature__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0 14px;
}

.articles-feature__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.articles-feature__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
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
  background: linear-gradient(180deg, #d6e4ff, #f0f5ff 30%, #e8e8e8 100%);
}

.articles-archive__section {
  position: relative;
  display: grid;
  grid-template-columns: 32px 1fr;
  column-gap: 24px;
  margin-bottom: 38px;
}

.articles-archive__section--intro {
  margin-bottom: 44px;
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
  border: 3px solid #1677ff;
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

.articles-archive__group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e8e8e8;
}

.articles-archive__group-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: #262626;
}

.articles-archive__group-count {
  font-size: 13px;
  color: #8c8c8c;
}

.articles-archive__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.articles-archive__item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: linear-gradient(145deg, #ffffff, #fbfdff);
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.articles-archive__item:hover {
  transform: translateX(2px);
  border-color: rgba(22, 119, 255, 0.18);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
}

.articles-archive__item-date {
  font-size: 14px;
  line-height: 1.8;
  color: #8c8c8c;
}

.articles-archive__item-main {
  min-width: 0;
}

.articles-archive__item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.articles-archive__item-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.6;
  color: #262626;
}

.articles-archive__item-read {
  font-size: 12px;
  color: #8c8c8c;
}

.articles-archive__item-summary {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.85;
  color: #595959;
}

.articles-archive__item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

@media (max-width: 1200px) {
  .articles-page__toolbar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .articles-page__hero {
    flex-direction: column;
  }

  .articles-page__title {
    font-size: 28px;
  }

  .articles-page__metrics,
  .articles-feature {
    grid-template-columns: 1fr;
  }

  .articles-archive__section {
    grid-template-columns: 28px 1fr;
    column-gap: 16px;
  }

  .articles-archive__item {
    grid-template-columns: 1fr;
  }

  .articles-archive__item-head,
  .articles-archive__group-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
