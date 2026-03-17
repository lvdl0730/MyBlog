export interface MockArticleItem {
  id: number;
  title: string;
  summary: string;
  cover: string;
  createdAt: string;
  wordCount: number;
  readingMinutes: number;
  tags: string[];
  pinnedRank?: number;
  pinnedAt?: string;
}

export interface MockCarouselItem {
  id: number;
  image: string;
  title: string;
  desc: string;
  articleId?: number;
}

export const mockCarouselList: MockCarouselItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    title: "记录博客搭建过程",
    desc: "从布局骨架到内容系统，再到计划与搜索，把个人博客一步步做成完整作品。",
    articleId: 1,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    title: "整理前端实施思路",
    desc: "把路由、状态、页面结构和交互细节串起来，减少后续返工成本。",
    articleId: 2,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1400&q=80",
    title: "沉淀自己的知识库",
    desc: "让博客不仅展示项目，也能持续积累文章、计划和实践笔记。",
    articleId: 3,
  },
];

export const mockArticles: MockArticleItem[] = [
  {
    id: 1,
    title: "Vue3 博客后台布局搭建记录",
    summary: "从 BasicLayout 开始，逐步完成顶部栏、侧边栏、面包屑以及内容区的结构拆分。",
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-03-12",
    wordCount: 3200,
    readingMinutes: 8,
    tags: ["Vue3", "Ant Design Vue", "Layout"],
    pinnedRank: 1,
    pinnedAt: "2026-03-12",
  },
  {
    id: 2,
    title: "从零设计个人博客的前端路由结构",
    summary: "梳理首页、文章、计划、标签、详情页的路由分层，并为 breadcrumb 提前设计 meta 结构。",
    cover:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-03-09",
    wordCount: 2800,
    readingMinutes: 7,
    tags: ["Router", "Breadcrumb", "工程化"],
    pinnedRank: 2,
    pinnedAt: "2026-03-09",
  },
  {
    id: 3,
    title: "文章列表页静态版实现",
    summary: "先完成列表页和详情页链路，再逐步升级为更完整的内容系统。",
    cover:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-03-06",
    wordCount: 2100,
    readingMinutes: 5,
    tags: ["Articles", "Mock", "Frontend"],
    pinnedRank: 3,
    pinnedAt: "2026-03-06",
  },
  {
    id: 4,
    title: "Pinia 在博客后台中的状态拆分思路",
    summary: "把登录态、UI 状态、内容缓存拆开，避免后期页面越多时状态管理混乱。",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-03-01",
    wordCount: 2500,
    readingMinutes: 6,
    tags: ["Pinia", "Store", "State"],
  },
  {
    id: 5,
    title: "Ant Design Vue 面包屑接入记录",
    summary: "让 breadcrumb 不再写死，而是由 route meta 驱动。",
    cover:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-02-26",
    wordCount: 1800,
    readingMinutes: 4,
    tags: ["Ant Design Vue", "Breadcrumb"],
  },
  {
    id: 6,
    title: "博客首页卡片区设计草稿",
    summary: "尝试把文章卡片流搬到首页，用作置顶和最新文章聚合区。",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-02-21",
    wordCount: 1600,
    readingMinutes: 4,
    tags: ["Home", "UI", "Card"],
  },
  {
    id: 7,
    title: "标签页路由结构预设计",
    summary: "提前规划 /tags 和 /tags/:tagSlug 两条路由，避免后续返工。",
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-02-15",
    wordCount: 2200,
    readingMinutes: 5,
    tags: ["Tags", "Router"],
  },
  {
    id: 8,
    title: "Markdown 编辑器选型对比",
    summary: "围绕 md-editor-v3 和 ByteMD 做对比，准备后续接入图片上传。",
    cover:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-02-10",
    wordCount: 3000,
    readingMinutes: 7,
    tags: ["Markdown", "Editor"],
  },
];
