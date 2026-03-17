<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PictureOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { mockArticles } from "@/data/mockArticles.ts";
import { buildEditorContent } from "@/data/mockArticleDetails.ts";
import { parseMarkdown } from "@/utils/markdown.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const editorTextareaRef = ref<HTMLTextAreaElement | null>(null);

const articleId = computed(() => Number(route.params.id));
const isEditing = computed(() => route.name === "article-edit");
const currentArticle = computed(() =>
  isEditing.value ? mockArticles.find((item) => item.id === articleId.value) ?? null : null,
);

const defaultContent = `# 前言

先写一句导语，说明这篇文章想解决什么问题。

## 背景

补充背景、上下文和为什么要做这件事。

## 实现思路

拆解你的方案、结构和关键取舍。

## 总结

收口这篇文章的结论和下一步。`;

const form = reactive({
  title: "",
  summary: "",
  cover: "",
  tagText: "",
  content: defaultContent,
  publishDate: "2026-03-17",
  readingMinutes: 6,
});

const fillForm = () => {
  if (currentArticle.value) {
    Object.assign(form, {
      title: currentArticle.value.title,
      summary: currentArticle.value.summary,
      cover: currentArticle.value.cover,
      tagText: currentArticle.value.tags.join(", "),
      content: buildEditorContent(currentArticle.value),
      publishDate: currentArticle.value.createdAt,
      readingMinutes: currentArticle.value.readingMinutes,
    });
    return;
  }

  Object.assign(form, {
    title: "",
    summary: "",
    cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tagText: "Vue3, Markdown",
    content: defaultContent,
    publishDate: "2026-03-17",
    readingMinutes: 6,
  });
};

watch(currentArticle, fillForm, { immediate: true });

const parsedTags = computed(() =>
  form.tagText
    .split(/[，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean),
);

const parsedMarkdown = computed(() => parseMarkdown(form.content));
const estimatedWordCount = computed(() => form.content.replace(/\s+/g, "").length);
const pageTitle = computed(() => (isEditing.value ? "编辑文章" : "写文章"));
const pageDesc = computed(() =>
  isEditing.value
    ? "当前为编辑模式，表单已用现有文章内容预填。"
    : "现在这是一版真正可写的 Markdown 工作台，后面再接真实保存接口。",
);

const insertText = (snippet: string) => {
  const textarea = editorTextareaRef.value;
  if (!textarea) {
    form.content = `${form.content}\n\n${snippet}`.trim();
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  form.content = `${form.content.slice(0, start)}${snippet}${form.content.slice(end)}`;
  requestAnimationFrame(() => {
    const nextPosition = start + snippet.length;
    textarea.focus();
    textarea.setSelectionRange(nextPosition, nextPosition);
  });
};

const openImagePicker = () => {
  fileInputRef.value?.click();
};

const handleImageSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === "string" ? reader.result : "";
    if (!result) return;
    const snippet = `\n\n![${file.name}](${result})\n\n`;
    insertText(snippet);
    message.success("图片已作为临时 Data URL 插入正文");
    input.value = "";
  };
  reader.readAsDataURL(file);
};

const goBack = () => {
  if (isEditing.value && currentArticle.value) {
    router.push(`/detail/${currentArticle.value.id}`);
    return;
  }
  router.push("/articles");
};

const saveDraft = () => {
  if (!form.title.trim()) return message.error("请先填写文章标题");
  message.success("草稿已保存在当前页面状态");
};

const publishArticle = () => {
  if (!form.title.trim()) return message.error("请先填写文章标题");
  if (!form.summary.trim()) return message.error("请先填写文章摘要");
  if (!form.content.trim()) return message.error("请先填写文章内容");
  message.success(isEditing.value ? "文章修改已提交" : "新文章已提交");
  router.push(isEditing.value && currentArticle.value ? `/detail/${currentArticle.value.id}` : "/articles");
};
</script>

<template>
  <div class="article-editor-page">
    <section class="article-editor-page__hero">
      <div>
        <p class="article-editor-page__eyebrow">Writer Workspace</p>
        <h2 class="article-editor-page__title">{{ pageTitle }}</h2>
        <p class="article-editor-page__desc">{{ pageDesc }}</p>
      </div>

      <div class="article-editor-page__actions">
        <a-button @click="goBack">返回</a-button>
        <a-button @click="saveDraft">
          <template #icon><SaveOutlined /></template>
          保存草稿
        </a-button>
        <a-button type="primary" @click="publishArticle">
          <template #icon><SendOutlined /></template>
          {{ isEditing ? "更新文章" : "发布文章" }}
        </a-button>
      </div>
    </section>

    <a-alert
      v-if="!authStore.isAdmin"
      type="warning"
      show-icon
      message="当前不是管理员模式"
      description="页面已经可写，但正式写作入口仍然建议在管理员模式下使用。"
      class="article-editor-page__alert"
    />

    <div v-if="isEditing && !currentArticle" class="article-editor-page__empty">
      <a-empty description="没有找到要编辑的文章">
        <a-button type="primary" @click="goBack">返回文章列表</a-button>
      </a-empty>
    </div>

    <div v-else class="article-editor-layout">
      <section class="article-editor-main">
        <div class="editor-card">
          <a-form layout="vertical">
            <a-form-item label="文章标题">
              <a-input v-model:value="form.title" placeholder="输入一个明确的标题" size="large" />
            </a-form-item>
            <a-form-item label="文章摘要">
              <a-textarea v-model:value="form.summary" :rows="4" placeholder="用两三句话说明这篇文章的重点" />
            </a-form-item>
            <a-form-item label="封面图链接">
              <a-input v-model:value="form.cover" placeholder="https://..." />
            </a-form-item>
            <div class="editor-card__grid">
              <a-form-item label="标签">
                <a-input v-model:value="form.tagText" placeholder="多个标签用逗号分隔" />
              </a-form-item>
              <a-form-item label="发布日期">
                <a-date-picker v-model:value="form.publishDate" value-format="YYYY-MM-DD" format="YYYY年MM月DD日" style="width: 100%" />
              </a-form-item>
            </div>
            <a-form-item label="预计阅读时长（分钟）">
              <a-input-number v-model:value="form.readingMinutes" :min="1" style="width: 100%" />
            </a-form-item>
          </a-form>
        </div>

        <div class="editor-card">
          <div class="editor-workbench__head">
            <div>
              <p class="article-editor-page__eyebrow">Markdown Editor</p>
              <h3 class="editor-card__title">正文编辑区</h3>
            </div>
            <div class="editor-workbench__actions">
              <a-button @click="insertText('\n## 新章节\n\n')">插入 H2</a-button>
              <a-button @click="insertText('\n- 新的列表项\n')">插入列表</a-button>
              <a-button @click="openImagePicker">
                <template #icon><PictureOutlined /></template>
                插入图片
              </a-button>
              <input ref="fileInputRef" type="file" accept="image/*" hidden @change="handleImageSelect" />
            </div>
          </div>
          <div class="editor-workbench">
            <div class="editor-pane">
              <div class="editor-pane__label">Markdown</div>
              <textarea
                ref="editorTextareaRef"
                v-model="form.content"
                class="editor-textarea"
                spellcheck="false"
                placeholder="在这里直接编写 Markdown 内容"
              ></textarea>
            </div>
            <div class="editor-pane editor-pane--preview">
              <div class="editor-pane__label">预览</div>
              <div class="markdown-body markdown-body--preview" v-html="parsedMarkdown.html"></div>
            </div>
          </div>
        </div>
      </section>

      <aside class="article-editor-aside">
        <div class="editor-card editor-card--soft">
          <p class="article-editor-page__eyebrow">Outline Preview</p>
          <h3 class="editor-card__title">文章大纲</h3>
          <div v-if="parsedMarkdown.outline.length" class="editor-outline">
            <div v-for="item in parsedMarkdown.outline" :key="item.id" class="editor-outline__item" :class="`is-level-${item.level}`">
              <span class="editor-outline__title">{{ item.title }}</span>
            </div>
          </div>
          <a-empty v-else description="正文里输入 # 或 ## 标题后会显示在这里" />
        </div>

        <div class="editor-card">
          <p class="article-editor-page__eyebrow">Meta Preview</p>
          <h3 class="editor-card__title">发布信息</h3>
          <div class="editor-meta">
            <div><span>标签数量</span><strong>{{ parsedTags.length }}</strong></div>
            <div><span>正文字符数</span><strong>{{ estimatedWordCount }}</strong></div>
            <div><span>预计阅读</span><strong>{{ form.readingMinutes }} 分钟</strong></div>
          </div>
          <div class="editor-tags">
            <a-tag v-for="tag in parsedTags" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>

        <div class="editor-card editor-card--soft">
          <p class="article-editor-page__eyebrow">Upload Note</p>
          <h3 class="editor-card__title">图片上传说明</h3>
          <p class="editor-note">
            当前“插入图片”是前端临时方案，会把本地图片转成 Data URL 插进 Markdown，用于预览和演示。
          </p>
          <p class="editor-note">
            真正的图片上传与持久化仍然需要后端接口、文件存储和返回可访问 URL，这部分我们可以下一步再接。
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.article-editor-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.article-editor-page__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.article-editor-page__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.article-editor-page__title {
  margin: 0 0 10px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.22;
  color: #1f1f1f;
}

.article-editor-page__desc {
  max-width: 760px;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #8c8c8c;
}

.article-editor-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.article-editor-page__alert {
  margin-bottom: 4px;
}

.article-editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
  align-items: start;
}

.editor-card {
  padding: 24px;
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.04);
}

.editor-card + .editor-card {
  margin-top: 18px;
}

.editor-card--soft {
  background: linear-gradient(145deg, #f9fbff, #ffffff);
}

.editor-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.editor-card__title {
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
}

.article-editor-aside {
  position: sticky;
  top: 96px;
}

.editor-workbench__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.editor-workbench__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.editor-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}

.editor-pane {
  min-width: 0;
  border: 1px solid #edf1f7;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
}

.editor-pane--preview {
  background: #fcfdff;
}

.editor-pane__label {
  padding: 12px 16px;
  border-bottom: 1px solid #edf1f7;
  font-size: 13px;
  font-weight: 700;
  color: #8c8c8c;
}

.editor-textarea {
  width: 100%;
  min-height: 720px;
  padding: 18px 20px;
  border: none;
  outline: none;
  resize: vertical;
  font: inherit;
  line-height: 1.8;
  color: #262626;
}

.markdown-body--preview {
  min-height: 720px;
  padding: 18px 20px;
}

.editor-outline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-outline__item {
  padding: 8px 10px;
  border-radius: 12px;
  background: #f8fbff;
}

.editor-outline__item.is-level-2 {
  padding-left: 22px;
}

.editor-outline__item.is-level-3 {
  padding-left: 34px;
}

.editor-outline__title {
  font-size: 14px;
  line-height: 1.6;
  color: #595959;
}

.editor-meta {
  display: grid;
  gap: 12px;
}

.editor-meta > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #f0f0f0;
}

.editor-meta > div:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.editor-meta span {
  font-size: 13px;
  color: #8c8c8c;
}

.editor-meta strong {
  color: #1f1f1f;
}

.editor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.editor-note {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #595959;
}

.editor-note + .editor-note {
  margin-top: 12px;
}

.article-editor-page__empty {
  padding: 24px;
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: #ffffff;
}

:deep(.markdown-body) {
  color: #262626;
  font-size: 15px;
  line-height: 1.9;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin: 0;
  color: #1f1f1f;
}

:deep(.markdown-body h1) {
  margin-bottom: 18px;
  font-size: 28px;
}

:deep(.markdown-body h2) {
  margin-top: 28px;
  margin-bottom: 12px;
  font-size: 22px;
}

:deep(.markdown-body h3) {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

:deep(.markdown-body p) {
  margin: 0;
}

:deep(.markdown-body p + p) {
  margin-top: 12px;
}

:deep(.markdown-body ul) {
  margin: 14px 0;
  padding-left: 20px;
}

:deep(.markdown-body pre) {
  margin: 18px 0;
  padding: 16px 18px;
  border-radius: 16px;
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

:deep(.markdown-body img) {
  display: block;
  max-width: 100%;
  margin: 18px auto;
  border-radius: 16px;
}

@media (max-width: 1200px) {
  .article-editor-layout,
  .editor-workbench {
    grid-template-columns: 1fr;
  }

  .article-editor-aside {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-editor-page__hero,
  .editor-workbench__head {
    flex-direction: column;
  }

  .article-editor-page__title {
    font-size: 28px;
  }

  .editor-card,
  .article-editor-page__empty {
    padding: 20px;
  }

  .editor-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
