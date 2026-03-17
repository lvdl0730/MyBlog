import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import BasicLayout from "@/layouts/BasicLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Home from "@/views/HomePage.vue";
import Articles from "@/views/ArticlesPage.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import ArticleEditor from "@/views/ArticleEditorPage.vue";
import Plans from "@/views/PlansWorkspacePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ForgotPasswordPage from "@/views/ForgotPasswordPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import NotFound from "@/views/NotFound.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { pinia } from "@/stores/pinia";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: BasicLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: {
          title: "首页",
          hideBreadcrumb: true,
        },
      },
      {
        path: "articles",
        name: "articles",
        component: Articles,
        meta: {
          title: "文章",
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "文章" },
          ] satisfies BreadcrumbItem[],
        },
      },
      {
        path: "detail/:id",
        name: "article-detail",
        component: ArticleDetail,
        meta: {
          title: "文章详情",
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "文章", to: "/articles" },
            { label: "文章详情" },
          ] satisfies BreadcrumbItem[],
        },
      },
      {
        path: "editor/new",
        name: "article-create",
        component: ArticleEditor,
        meta: {
          title: "写文章",
          requiresAdmin: true,
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "文章", to: "/articles" },
            { label: "写文章" },
          ] satisfies BreadcrumbItem[],
        },
      },
      {
        path: "editor/:id",
        name: "article-edit",
        component: ArticleEditor,
        meta: {
          title: "编辑文章",
          requiresAdmin: true,
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "文章", to: "/articles" },
            { label: "编辑文章" },
          ] satisfies BreadcrumbItem[],
        },
      },
      {
        path: "plans",
        name: "plans",
        component: Plans,
        meta: {
          title: "计划",
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "计划" },
          ] satisfies BreadcrumbItem[],
        },
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
        meta: {
          title: "用户中心",
          requiresAuth: true,
          breadcrumb: [
            { label: "首页", to: "/" },
            { label: "用户中心" },
          ] satisfies BreadcrumbItem[],
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "",
        redirect: { name: "login" },
      },
      {
        path: "login",
        name: "login",
        component: LoginPage,
        meta: {
          title: "用户登录",
          guestOnly: true,
        },
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
        meta: {
          title: "用户注册",
          guestOnly: true,
        },
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: ForgotPasswordPage,
        meta: {
          title: "找回密码",
          guestOnly: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      title: "页面不存在",
      hideBreadcrumb: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia);

  if (to.meta.requiresAdmin) {
    if (authStore.isAdmin) return true;
    if (authStore.isLogin) return { name: "home" };
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresAuth && !authStore.isLogin) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authStore.isLogin) {
    return { name: "home" };
  }

  return true;
});

router.afterEach((to) => {
  const pageTitle = (to.meta.title as string | undefined) ?? "小夏的博客";
  document.title = `${pageTitle} - 小夏的博客`;
});

export default router;
