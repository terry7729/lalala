import Vue from 'vue';

import App from './user';
import '../../assets/css/base.css'
// 导入自己抽取的插件
import myHttp from '../myHttp'
// use一下
Vue.use(myHttp)
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
});