<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui.ts";
import { useAuthStore } from "@/stores/auth.ts";
import {
  CalendarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";

const router = useRouter();
const uiStore = useUiStore();
const authStore = useAuthStore();

const goToLogin = () => {
  router.push("/auth/login");
};

const goToRegister = () => {
  router.push("/auth/register");
};

const goToProfile = () => {
  router.push("/profile");
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <a-layout-header class="app-header">
    <div class="app-header__left">
      <a-button type="text" class="header-trigger-btn" @click="uiStore.toggleSider()">
        <template #icon>
          <MenuUnfoldOutlined v-if="!uiStore.siderOpen" />
          <MenuFoldOutlined v-else />
        </template>
      </a-button>
      <span v-if="uiStore.headerShowTitle" class="site-title">小夏的博客</span>
    </div>

    <nav class="app-header__center" aria-label="顶部导航">
      <RouterLink to="/" class="header-nav-item" active-class="is-active" exact-active-class="is-active">
        <span class="header-nav-item__content">
          <HomeOutlined />
          <span>首页</span>
        </span>
        <span class="header-nav-item__line" aria-hidden="true"></span>
      </RouterLink>

      <RouterLink to="/articles" class="header-nav-item" active-class="is-active">
        <span class="header-nav-item__content">
          <FileTextOutlined />
          <span>文章</span>
        </span>
        <span class="header-nav-item__line" aria-hidden="true"></span>
      </RouterLink>

      <RouterLink to="/plans" class="header-nav-item" active-class="is-active">
        <span class="header-nav-item__content">
          <CalendarOutlined />
          <span>计划</span>
        </span>
        <span class="header-nav-item__line" aria-hidden="true"></span>
      </RouterLink>

      <button
        type="button"
        class="header-nav-item header-nav-item--button"
        :class="{ 'is-active': uiStore.searchModalOpen }"
        @click="uiStore.openSearch()"
      >
        <span class="header-nav-item__content">
          <SearchOutlined />
          <span>搜索</span>
        </span>
        <span class="header-nav-item__line" aria-hidden="true"></span>
      </button>
    </nav>

    <div class="app-header__right">
      <a-dropdown placement="bottomRight" trigger="click">
        <div class="user-entry">
          <a-avatar :src="authStore.avatar || undefined" :size="36">
            <template v-if="!authStore.avatar">
              {{ authStore.nickname.slice(0, 1) }}
            </template>
          </a-avatar>
          <span class="user-name">{{ authStore.nickname }}</span>
        </div>

        <template #overlay>
          <a-menu>
            <template v-if="!authStore.isLogin">
              <a-menu-item key="login" @click="goToLogin">
                <LoginOutlined />
                <span>用户登录</span>
              </a-menu-item>
              <a-menu-item key="register" @click="goToRegister">
                <UserAddOutlined />
                <span>用户注册</span>
              </a-menu-item>
            </template>
            <template v-else>
              <a-menu-item key="profile" @click="goToProfile">
                <UserOutlined />
                <span>用户中心</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined />
                <span>退出登录</span>
              </a-menu-item>
            </template>
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
  align-items: stretch;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 0 2px;
  color: #595959;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.header-nav-item--button {
  font: inherit;
}

.header-nav-item__content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.header-nav-item__line {
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: #1677ff;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.header-nav-item:hover,
.header-nav-item.is-active {
  color: #1677ff;
}

.header-nav-item:hover .header-nav-item__line,
.header-nav-item.is-active .header-nav-item__line {
  opacity: 1;
  transform: scaleX(1);
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

@media (max-width: 1080px) {
  .app-header {
    grid-template-columns: 180px 1fr 180px;
  }

  .app-header__center {
    gap: 20px;
  }
}

@media (max-width: 860px) {
  .app-header {
    grid-template-columns: 1fr auto;
    gap: 12px;
  }

  .app-header__center {
    display: none;
  }
}
</style>
