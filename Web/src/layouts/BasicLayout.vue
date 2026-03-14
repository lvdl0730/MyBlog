<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterView, RouterLink } from "vue-router";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useUiStore } from "@/stores/ui.ts";
import GlobalSider from "@/components/GlobalSider.vue";
import GlobalHeader from "@/components/GlobalHeader.vue";

const uiStore = useUiStore();
const route = useRoute();

// 面包屑类型
type BreadcrumbItem = {
  label: string;
  to?: string;
};

// 从当前路由meta中读取面包屑数据
const breadcrumbList = computed<BreadcrumbItem[]>(() => {
  return (route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? [];
});

// 是否显示面包屑 交给meta控制
const showBreadcrumb = computed(() => {
  const hideBreadcrumb = route.meta.hideBreadcrumb as boolean | undefined;
  return !hideBreadcrumb && breadcrumbList.value.length > 0;
});
</script>

<template>
  <a-layout class="basic-layout">
    <!-- 侧边栏 -->
    <GlobalSider />

    <a-layout>
      <!-- 顶部栏 -->
      <GlobalHeader />

      <a-layout-content class="basic-layout__content">
        <!-- 面包屑 - 首页不显示 -->
        <div v-if="showBreadcrumb" class="basic-layout__breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item
              v-for="item in breadcrumbList"
              :key="`${item.label}-${item.to || 'current'}`"
            >
              <!-- 带to跳转的面包屑项可点击 -->
              <RouterLink v-if="item.to" :to="item.to">
                {{ item.label }}
              </RouterLink>
              <!-- 不带to的面包屑项(一般是当前页)只显示文字不可点击 -->
              <span v-else>
                {{ item.label }}
              </span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <!-- 顶部公共区域 占位 后续放标题/操作区域 -->
        <div class="basic-layout__topbar" v-if="false"></div>

        <!-- 页面主体 -->
        <div class="basic-layout__page">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>

    <!-- 搜索弹窗 -->
    <a-modal
      :open="uiStore.searchModalOpen"
      title="搜索"
      :footer="null"
      @cancel="uiStore.closeSearch()"
    >
      <a-input placeholder="请输入关键字">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </a-modal>
  </a-layout>
</template>

<style scoped>
.basic-layout {
  min-height: 100vh;
}

.basic-layout__content {
  margin: 16px;
}

/* 面包屑容器 */
.basic-layout__breadcrumb {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
}

/* 顶部公共区域预留 */
.basic-layout__breadcrumb {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
}

/* 页面主体内容 */
.basic-layout__page {
  min-height: calc(100vh - 64px - 32px - 56px);
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
}
</style>
