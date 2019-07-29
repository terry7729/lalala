// 导入axios
import axios from 'axios'

// 允许axios跨域携带cookie 默认是不携带
axios.defaults.withCredentials = true
let requestUrl
const hostname = window.location.hostname;
if (hostname.indexOf('192.168.0.57') != -1) {
    requestUrl = 'http://192.168.0.57:8585'
} else if (hostname.indexOf('47.244.177.24') != -1) {
    requestUrl = 'http://47.244.177.24:8585'
} else {
    requestUrl = "http://api-app.bochat.net"
}
axios.defaults.baseURL = requestUrl

function GetRequest() {
    var url = decodeURI(decodeURI(location.search)); //获取url中"?"符后的字串，使用了两次decodeRUI解码
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(strs[i].indexOf('=') + 1));
        }
        return theRequest;
    }
}



// axios.defaults.headers.common['Authorization'] = 'BoChat ' + postData.token



// var qs = require('qs');
// // 设置拦截器 (回调函数)
// axios.interceptors.request.use(config => {
//   if (config.method === 'post') {
//     config.data = qs.stringify(config.data);
//   }
//   return config
// }, error => {
//   // Do something with request error
//   Promise.reject(error)
// })

// 暴露出去
export default {
    install(Vue) {
        // 把axios 设置到Vue构造函数的原型上
        Vue.prototype.$http = axios;
    }
}