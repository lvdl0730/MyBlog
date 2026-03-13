<script setup lang="ts">
import { useUiStore } from "@/stores/ui.ts";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { SearchOutlined } from "@ant-design/icons-vue";
import GlobalSider from "@/components/GlobalSider.vue";
import GlobalHeader from "@/components/GlobalHeader.vue";

const uiStore = useUiStore();
const route = useRoute();

// 面包屑数据
const breadcrumbList = computed(()=>{
  return (route.meta.breadcrumb as string[])||[]
})

// 是否显示面包屑
const showBreadcrumb = computed(()=>route.path !== '/')
</script>

<template>
  <a-layout class="basic-layout">
    <!-- 侧边栏 -->
    <GlobalSider/>

    <a-layout>
      <!-- 顶部栏 -->
      <GlobalHeader/>

      <a-layout-content class="basic-layout__content">
        <!-- 面包屑 - 首页不显示 -->
        <div v-if="showBreadcrumb" class="basic-layout__breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item
                v-for="item in breadcrumbList"
                :key="item"
            >
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

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

.basic-layout__breadcrumb {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
}

.basic-layout__page {
  min-height: calc(100vh - 64px - 32px - 56px);
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
}
</style>