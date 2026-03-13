import { defineStore } from "pinia"
import { ref,computed } from 'vue'

// 用户角色类型
export type UserRole = 'admin' | 'user' | ''

// 用户认证状态仓库
export const useAuthStore = defineStore("auth", ()=>{
    // 用户昵称/头像地址/当前角色
    const nickname = ref('游客')
    const avatar = ref('')
    const role = ref<UserRole>('')

    // 是否已登录
    const isLogin = computed(()=> !!role.value)
    // 是否为管理员
    const isAdmin = computed(()=> role.value === 'admin')

    // 模拟管理员登录
    function mockLoginAsAdmin(){
        nickname.value = '管理员'
        avatar.value = ''
        role.value = 'admin'
    }
    // 模拟普通用户登录
    function mockLoginAsUser(){
        nickname.value = '普通用户'
        avatar.value = ''
        role.value = 'user'
    }
    // 退出登录
    function logout(){
        nickname.value = '游客'
        avatar.value = ''
        role.value = ''
    }

    return {
        nickname,
        avatar,
        role,
        isLogin,
        isAdmin,
        mockLoginAsAdmin,
        mockLoginAsUser,
        logout,
    }
})