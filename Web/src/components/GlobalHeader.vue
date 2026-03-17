<script setup lang="ts">
import {useUiStore} from "@/stores/ui.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'

const uiStore = useUiStore();
const authStore = useAuthStore();
</script>

<template>
<a-layout-header class="app-header">
  <div class="app-header__left">
    <!-- 折叠/展开侧边栏按钮 -->
    <a-button type="text" class="header-trigger-btn" @click="uiStore.toggleSider()">
      <template #icon>
        <MenuUnfoldOutlined v-if="!uiStore.siderOpen" />
        <MenuFoldOutlined v-else />
      </template>
    </a-button>
    <!-- 侧边栏收起时，顶部显示标题 -->
    <span v-if="uiStore.headerShowTitle" class="site-title">小夏的博客</span>
  </div>

  <div class="app-header__center">
    <!-- 导航栏 -->
    <RouterLink to="/" class="header-nav-item" active-class="is-active" exact-active-class="is-active">
      <HomeOutlined />
      <span>首页</span>
    </RouterLink>
    <RouterLink to="/articles" class="header-nav-item" active-class="is-active">
      <FileTextOutlined />
      <span>文章</span>
    </RouterLink>
    <RouterLink to="/plans" class="header-nav-item" active-class="is-active">
      <CalendarOutlined />
      <span>计划</span>
    </RouterLink>
    <a class="header-nav-item" :class="{ 'is-active': uiStore.searchModalOpen }" @click="uiStore.openSearch()">
      <SearchOutlined />
      <span>搜索</span>
    </a>
  </div>

  <div class="app-header__right">
    <a-dropdown placement="bottomRight" trigger="click">
    <div class="user-entry">
      <!-- 头像 -->
      <a-avatar :src="authStore.avatar || undefined" :size="36">
        <template v-if="!authStore.avatar">
          {{authStore.nickname.slice(0,1)}}
        </template>
      </a-avatar>
      <!-- 昵称 -->
      <span class="user-name">{{ authStore.nickname }}</span>
    </div>

    <template #overlay>
      <a-menu>
        <a-menu-item key="profile">
          <UserOutlined />
          <span>用户中心</span>
        </a-menu-item>

        <a-menu-divider />

        <a-menu-item key="logout" @click="authStore.logout()">
          <LogoutOutlined />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
    </a-dropdown>
  </div>
</a-layout-header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: var(--layout-sider-width, 220px);
  right: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: 240px 1fr 220px;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: border-box;
  overflow: hidden;
  transition: left 0.2s ease;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 32px;
}

.app-header__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.site-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.header-nav-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: 6px;
  padding: 0 2px 10px;
  cursor: pointer;
  color: #595959;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  background-image: linear-gradient(#1677ff, #1677ff);
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 0 2px;
  transition: color 0.2s ease, background-size 0.24s ease;
}

.header-nav-item:hover,
.header-nav-item.is-active {
  color: #1677ff;
  background-size: calc(100% - 8px) 2px;
}

.header-nav-item.is-active {
  font-weight: 600;
}

.user-entry {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-entry:hover {
  background: #f5f5f5;
}

.user-name {
  color: #262626;
  font-size: 14px;
  font-weight: 500;
}
</style>
