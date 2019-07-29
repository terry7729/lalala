import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入组件
// import login from '../components/login.vue'

// 规则
let routes = [

    {
        path: '/user',
        name: 'user',
        component: () =>
            import ('../page/users/user.vue')
    }
]

// 路由对象
let router = new VueRouter({
    mode: 'history',
    routes
})

// 暴露
export default router