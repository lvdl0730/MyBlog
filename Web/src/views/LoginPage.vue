<script setup lang="ts">
import { reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons-vue";
import CaptchaCanvas from "@/components/CaptchaCanvas.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { createCaptchaCode } from "@/utils/auth.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  account: "",
  password: "",
  captchaInput: "",
});

const captchaCode = ref(createCaptchaCode());

const refreshCaptcha = () => {
  captchaCode.value = createCaptchaCode();
};

const submitLogin = () => {
  if (!form.account.trim()) return message.error("请输入用户名或邮箱");
  if (!form.password.trim()) return message.error("请输入密码");
  if (form.password.trim().length < 6) return message.error("密码长度至少为 6 位");
  if (!form.captchaInput.trim()) return message.error("请输入图形验证码");
  if (form.captchaInput.trim().toUpperCase() !== captchaCode.value) {
    refreshCaptcha();
    form.captchaInput = "";
    return message.error("图形验证码不正确");
  }

  const role = authStore.login({
    account: form.account,
    password: form.password,
  });

  message.success(role === "admin" ? "管理员登录成功" : "登录成功");
  router.push(typeof route.query.redirect === "string" ? route.query.redirect : "/");
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__head">
      <p class="auth-page__eyebrow">Sign In</p>
      <h2 class="auth-page__title">用户登录</h2>
      <p class="auth-page__desc">输入用户名或邮箱、密码和图形验证码后即可进入站点。</p>
    </div>

    <a-alert
      type="info"
      show-icon
      class="auth-page__alert"
      message="演示说明"
      description="当前为前端演示登录：账号里包含 admin 会被识别为管理员，其他账号默认为普通用户。"
    />

    <a-form
      layout="horizontal"
      class="auth-form"
      :label-col="{ flex: '124px' }"
      :wrapper-col="{ flex: '1 1 0' }"
      label-align="left"
      @finish="submitLogin"
    >
      <a-form-item label="账号">
        <a-input v-model:value="form.account" size="large" placeholder="输入用户名或邮箱" allow-clear>
          <template #prefix>
            <UserOutlined v-if="!form.account.includes('@')" />
            <MailOutlined v-else />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="密码">
        <a-input-password
          v-model:value="form.password"
          size="large"
          placeholder="输入密码"
          autocomplete="current-password"
          allow-clear
        >
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="验证码">
        <div class="auth-form__captcha-row">
          <a-input
            v-model:value="form.captchaInput"
            size="large"
            placeholder="输入右侧验证码"
            maxlength="4"
            allow-clear
          >
            <template #prefix><SafetyCertificateOutlined /></template>
          </a-input>
          <CaptchaCanvas :code="captchaCode" @refresh="refreshCaptcha" />
        </div>
      </a-form-item>

      <div class="auth-form__submit">
        <a-button type="primary" size="large" class="auth-form__submit-btn" @click="submitLogin">登录</a-button>
      </div>
    </a-form>

    <div class="auth-page__foot">
      <RouterLink to="/auth/register">还没有账号？点我注册</RouterLink>
      <RouterLink to="/auth/forgot-password">找回密码</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.auth-page__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-page__eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.auth-page__title {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
  color: #111827;
}

.auth-page__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
  color: #64748b;
}

.auth-page__alert {
  border-radius: 18px;
}

.auth-form__captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px;
  gap: 12px;
}

.auth-form__submit {
  display: flex;
  justify-content: center;
  padding-left: 0;
}

.auth-form :deep(.ant-form-item) {
  margin-bottom: 18px;
}

.auth-form :deep(.ant-form-item-label > label) {
  justify-content: center;
  width: 100%;
  color: #334155;
  font-weight: 600;
}

.auth-form__submit-btn {
  min-width: 300px;
}

.auth-page__foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
}

.auth-page__foot a {
  color: #1677ff;
  text-decoration: none;
}

@media (max-width: 640px) {
  .auth-page__title {
    font-size: 28px;
  }

  .auth-form :deep(.ant-form-item-row) {
    flex-direction: column;
    align-items: stretch;
  }

  .auth-form :deep(.ant-form-item-label) {
    padding-bottom: 8px;
  }

  .auth-form__captcha-row {
    grid-template-columns: 1fr;
  }

  .auth-form__submit {
    padding-left: 0;
  }

  .auth-form__submit-btn {
    width: 100%;
  }
}
</style>
