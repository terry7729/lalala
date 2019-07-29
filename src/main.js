import Vue from 'vue'
import App from './App.vue'
import 'vant/lib/index.css';

import './assets/css/base.css'
// 导入自己抽取的插件
import myHttp from './lib/myHttp'
import router from './lib/router'
// use一下
Vue.use(myHttp)


new Vue({
    render: h => h(App),
    router
}).$mount('#app')