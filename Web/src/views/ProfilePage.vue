<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { LogoutOutlined, ProfileOutlined, RocketOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";

const router = useRouter();
const authStore = useAuthStore();

const roleLabel = computed(() => (authStore.isAdmin ? "管理员" : "普通用户"));

const goToEditor = () => {
  router.push("/editor/new");
};

const goToPlans = () => {
  router.push("/plans");
};

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <div class="profile-page">
    <section class="profile-page__hero">
      <div>
        <p class="profile-page__eyebrow">User Center</p>
        <h2 class="profile-page__title">用户中心</h2>
        <p class="profile-page__desc">这里先放当前登录信息和几个常用入口，后面可以继续接个人资料、头像上传和安全设置。</p>
      </div>

      <div class="profile-page__hero-actions">
        <a-button @click="goToPlans">
          <template #icon><RocketOutlined /></template>
          查看计划
        </a-button>
        <a-button v-if="authStore.isAdmin" type="primary" @click="goToEditor">
          <template #icon><ProfileOutlined /></template>
          写文章
        </a-button>
        <a-button danger @click="logout">
          <template #icon><LogoutOutlined /></template>
          退出登录
        </a-button>
      </div>
    </section>

    <section class="profile-page__grid">
      <article class="profile-card">
        <span class="profile-card__label">当前昵称</span>
        <strong class="profile-card__value">{{ authStore.nickname }}</strong>
      </article>
      <article class="profile-card">
        <span class="profile-card__label">登录邮箱</span>
        <strong class="profile-card__value">{{ authStore.email || "未提供" }}</strong>
      </article>
      <article class="profile-card">
        <span class="profile-card__label">身份角色</span>
        <strong class="profile-card__value">{{ roleLabel }}</strong>
      </article>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.profile-page__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 28px;
  border: 1px solid #edf1f7;
  border-radius: 26px;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.profile-page__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.profile-page__title {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
  color: #111827;
}

.profile-page__desc {
  max-width: 720px;
  margin: 12px 0 0;
  line-height: 1.85;
  color: #64748b;
}

.profile-page__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.profile-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.profile-card {
  padding: 24px;
  border: 1px solid #edf1f7;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
}

.profile-card__label {
  display: block;
  font-size: 13px;
  color: #8c8c8c;
}

.profile-card__value {
  display: block;
  margin-top: 12px;
  font-size: 24px;
  line-height: 1.35;
  color: #111827;
}

@media (max-width: 960px) {
  .profile-page__hero,
  .profile-page__grid {
    grid-template-columns: 1fr;
  }

  .profile-page__hero {
    flex-direction: column;
  }
}
</style>
