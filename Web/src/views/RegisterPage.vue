<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons-vue";
import CaptchaCanvas from "@/components/CaptchaCanvas.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { createCaptchaCode, createEmailCode, isValidEmail } from "@/utils/auth.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: "",
  email: "",
  emailCode: "",
  password: "",
  confirmPassword: "",
  captchaInput: "",
});

const captchaCode = ref(createCaptchaCode());
const sentEmailCode = ref("");
const sending = ref(false);
const countdown = ref(0);
let timerId: number | null = null;

const refreshCaptcha = () => {
  captchaCode.value = createCaptchaCode();
};

const startCountdown = () => {
  countdown.value = 60;
  timerId = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }, 1000);
};

const sendEmailCode = () => {
  if (!isValidEmail(form.email)) return message.error("请输入有效的邮箱地址");
  if (countdown.value > 0) return;

  sending.value = true;
  sentEmailCode.value = createEmailCode();
  window.setTimeout(() => {
    sending.value = false;
    startCountdown();
    message.success(`模拟验证码已发送：${sentEmailCode.value}`);
  }, 500);
};

const submitRegister = () => {
  if (!form.username.trim()) return message.error("请输入用户名");
  if (!isValidEmail(form.email)) return message.error("请输入有效的邮箱地址");
  if (!form.emailCode.trim()) return message.error("请输入邮箱验证码");
  if (form.emailCode.trim() !== sentEmailCode.value) return message.error("邮箱验证码不正确");
  if (!form.password.trim()) return message.error("请输入密码");
  if (form.password.length < 6) return message.error("密码长度至少为 6 位");
  if (form.confirmPassword !== form.password) return message.error("两次输入的密码不一致");
  if (!form.captchaInput.trim()) return message.error("请输入图形验证码");
  if (form.captchaInput.trim().toUpperCase() !== captchaCode.value) {
    form.captchaInput = "";
    refreshCaptcha();
    return message.error("图形验证码不正确");
  }

  authStore.register({
    username: form.username,
    email: form.email,
    password: form.password,
  });

  message.success("注册成功，已自动登录");
  router.push(typeof route.query.redirect === "string" ? route.query.redirect : "/profile");
};

onBeforeUnmount(() => {
  if (timerId) window.clearInterval(timerId);
});
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__head">
      <p class="auth-page__eyebrow">Create Account</p>
      <h2 class="auth-page__title">用户注册</h2>
      <p class="auth-page__desc">注册时需要完成邮箱验证码、密码确认和图形验证码校验。</p>
    </div>

    <a-form
      layout="horizontal"
      class="auth-form"
      :label-col="{ flex: '124px' }"
      :wrapper-col="{ flex: '1 1 0' }"
      label-align="left"
      @finish="submitRegister"
    >
      <a-form-item label="用户名">
        <a-input v-model:value="form.username" size="large" placeholder="输入用户名" allow-clear>
          <template #prefix><UserOutlined /></template>
        </a-input>
      </a-form-item>

      <a-form-item label="邮箱">
        <a-input v-model:value="form.email" size="large" placeholder="输入邮箱地址" allow-clear>
          <template #prefix><MailOutlined /></template>
        </a-input>
      </a-form-item>

      <a-form-item label="邮箱验证码">
        <div class="auth-form__row">
          <a-input
            v-model:value="form.emailCode"
            size="large"
            placeholder="输入 6 位邮箱验证码"
            maxlength="6"
            allow-clear
          />
          <a-button size="large" :loading="sending" :disabled="countdown > 0" @click="sendEmailCode">
            {{ countdown > 0 ? `${countdown}s 后重发` : "发送验证码" }}
          </a-button>
        </div>
      </a-form-item>

      <a-form-item label="密码">
        <a-input-password v-model:value="form.password" size="large" placeholder="至少 6 位密码" allow-clear>
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="确认密码">
        <a-input-password v-model:value="form.confirmPassword" size="large" placeholder="再次输入密码" allow-clear>
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
        <a-button type="primary" size="large" class="auth-form__submit-btn" @click="submitRegister">注册并登录</a-button>
      </div>
    </a-form>

    <div class="auth-page__foot auth-page__foot--single">
      <RouterLink to="/auth/login">已有账号？点击登录</RouterLink>
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

.auth-form__row,
.auth-form__captcha-row {
  display: grid;
  gap: 12px;
}

.auth-form__row {
  grid-template-columns: minmax(0, 1fr) 148px;
}

.auth-form__captcha-row {
  grid-template-columns: minmax(0, 1fr) 128px;
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
  justify-content: flex-start;
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

  .auth-form__row,
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
