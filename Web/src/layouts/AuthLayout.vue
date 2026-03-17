<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
const pageTitle = computed(() => (route.meta.title as string | undefined) ?? "用户认证");
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__shell">
      <aside class="auth-layout__aside">
        <RouterLink to="/" class="auth-layout__brand">小夏的博客</RouterLink>
        <p class="auth-layout__eyebrow">Account Access</p>
        <h1 class="auth-layout__title">{{ pageTitle }}</h1>
        <p class="auth-layout__desc">
          这里统一承载登录、注册和找回密码。当前是前端演示流程，图形验证码和邮箱验证码都在本地校验。
        </p>
        <ul class="auth-layout__list">
          <li>登录支持“用户名或邮箱 + 密码 + 图形验证码”</li>
          <li>注册支持邮箱验证码、密码确认和图形验证码校验</li>
          <li>找回密码页补了新密码设置，否则流程无法真正完成</li>
        </ul>
        <RouterLink to="/" class="auth-layout__back">返回首页</RouterLink>
      </aside>

      <main class="auth-layout__main">
        <div class="auth-layout__card">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(22, 119, 255, 0.18), transparent 32%),
    linear-gradient(135deg, #f3f8ff 0%, #f7f9fc 52%, #ffffff 100%);
}

.auth-layout__shell {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(520px, 640px);
  align-items: center;
  width: min(1180px, 100%);
  gap: 28px;
}

.auth-layout__aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 28px;
  color: #0f172a;
}

.auth-layout__brand {
  display: inline-flex;
  align-items: center;
  margin-bottom: 28px;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
}

.auth-layout__eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1677ff;
}

.auth-layout__title {
  margin: 0;
  font-size: 40px;
  line-height: 1.15;
}

.auth-layout__desc {
  margin: 18px 0 0;
  font-size: 15px;
  line-height: 1.9;
  color: #475569;
}

.auth-layout__list {
  margin: 24px 0 0;
  padding-left: 18px;
  line-height: 1.9;
  color: #334155;
}

.auth-layout__back {
  display: inline-flex;
  width: fit-content;
  margin-top: 28px;
  color: #1677ff;
  font-weight: 600;
  text-decoration: none;
}

.auth-layout__main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.auth-layout__card {
  width: 100%;
  padding: 36px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
}

@media (max-width: 1080px) {
  .auth-layout {
    padding: 20px;
  }

  .auth-layout__shell {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .auth-layout__aside {
    padding: 20px 8px 0;
  }
}

@media (max-width: 640px) {
  .auth-layout__aside {
    padding: 12px 0 0;
  }

  .auth-layout__title {
    font-size: 32px;
  }

  .auth-layout__card {
    padding: 24px 20px;
    border-radius: 24px;
  }
}
</style>
