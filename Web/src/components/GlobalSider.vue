<script setup lang="ts">
import {computed,ref} from "vue";
import {useRoute} from "vue-router";
import {useUiStore} from "@/stores/ui.ts";
import {
  BookOutlined,
  HomeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TagsOutlined
} from '@ant-design/icons-vue'

const route = useRoute();
const uiStore = useUiStore();

// 当前高亮菜单
const selectedKeys = computed(() => [route.path])

// 统计数据(先写死占位)
const articleCount = ref(12)
const tagCount = ref(8)
</script>

<template>
<a-layout-sider
    class="app-sider"
    :collapsed="!uiStore.siderOpen"
    collapsible
    :trigger="null"
    collapsed-width="80"
    width="220"
>
  <!-- 侧边栏顶部标题 -->
  <div class="app-sider__logo">
    <RouterLink to="/" class="logo-link">
      <BookOutlined class="logo-icon" />
      <span v-if="uiStore.siderOpen" class="logo-text">小夏的博客</span>
    </RouterLink>
  </div>

  <!-- 统计部分 -->
  <div class="app-sider__stats">
    <RouterLink to="/articles" class="stats-card">
      <FileTextOutlined class="stats-icon" />
      <template v-if="uiStore.siderOpen" class="stats-content">
        <span class="stats-label">文章</span>
        <span class="stats-value">{{ articleCount }}</span>
      </template>
    </RouterLink>

    <RouterLink to="/tags" class="stats-card">
      <TagsOutlined class="stats-icon" />
      <template v-if="uiStore.siderOpen">
        <span class="stats-label">标签</span>
        <span class="stats-value">{{ tagCount }}</span>
      </template>
    </RouterLink>
  </div>

  <!-- 侧边栏菜单 -->
  <a-menu
    theme="dark"
    mode="inline"
    :selectedKeys="selectedKeys"
    class="app-sider__menu"
    :inline-collapsed="!uiStore.siderOpen"
    >
    <a-menu-item key="/">
      <RouterLink to="/" class="menu-link">
        <HomeOutlined />
        <span>首页</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="/articles">
      <RouterLink to="/articles" class="menu-link">
        <FileTextOutlined />
        <span>文章</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="/plans">
      <RouterLink to="/plans" class="menu-link">
        <CalendarOutlined />
        <span>计划</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="/tags">
      <RouterLink to="/tags" class="menu-link">
        <TagsOutlined />
        <span>标签</span>
      </RouterLink>
    </a-menu-item>
  </a-menu>
</a-layout-sider>
</template>

<style scoped>
.app-sider {
  min-height: 100vh;
  background: #001529;
}

.app-sider__logo {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: #ffffff;
  text-decoration: none;
  overflow: hidden;
}

.logo-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.app-sider__stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-height: 48px;
  padding: 0 14px;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.stats-card:hover {
  background: rgba(255, 255, 255, 0.12);
}

.stats-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.stats-label {
  flex: 1;
  font-size: 14px;
}

.stats-value {
  font-size: 16px;
  font-weight: 600;
}

.app-sider__menu {
  border-inline-end: none;
  background: transparent;
  padding-top: 8px;
}

.menu-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.app-sider.ant-layout-sider-collapsed .app-sider__logo {
  padding: 0;
  justify-content: center;
}

.app-sider.ant-layout-sider-collapsed .logo-link {
  justify-content: center;
}

.app-sider.ant-layout-sider-collapsed .app-sider__stats {
  padding: 16px 10px;
}

.app-sider.ant-layout-sider-collapsed .stats-card {
  justify-content: center;
  padding: 0;
}
</style>
