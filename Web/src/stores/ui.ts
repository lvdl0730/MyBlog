import { defineStore } from "pinia"
import { ref,computed } from 'vue'

// UI状态仓库
export const useUiStore = defineStore('ui',()=>{
    // 侧边栏是否展开
    const siderOpen = ref(true)
    // 搜索弹窗是否打开
    const searchModalOpen = ref(false)
    // 是否显示标题 - 若侧边栏展开，则标题不显示
    const headerShowTitle= computed(() => !siderOpen.value)

    // 切换侧边栏展开收起状态
    function toggleSider(){
        siderOpen.value = !siderOpen.value
    }

    // 打开搜索弹窗
    function openSearch(){
        searchModalOpen.value = true
    }
    // 关闭搜索弹窗
    function closeSearch(){
        searchModalOpen.value = false
    }

    // 重置UI状态
    function resetUiState() {
        siderOpen.value = true
        searchModalOpen.value = false
    }

    return {
        siderOpen,
        searchModalOpen,
        headerShowTitle,
        toggleSider,
        openSearch,
        closeSearch,
        resetUiState
    }
})