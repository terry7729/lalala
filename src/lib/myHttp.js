// 导入axios
import axios from 'axios'
import HASH from 'js-sha1'

// 允许axios跨域携带cookie 默认是不携带
axios.defaults.withCredentials = true

function requesturl() {
    var requestUrl;

    const hostname = window.location.hostname;
    if (hostname.indexOf('192.168.0.57') != -1) {
        requestUrl = 'http://192.168.0.57:8585'
    } else if (hostname.indexOf('47.244.177.24') != -1) {
        requestUrl = 'http://47.244.177.24:8585'
    } else {
        requestUrl = "http://api-app.bochat.net"
    }
    // requestUrl = "http://47.244.177.24:8585"
    // requestUrl = 'http://192.168.0.57:8585'  
    // requestUrl = "http://192.168.0.108:8585"
    return requestUrl;
}

const service = axios.create({
    baseURL: requesturl()
})

// 获取min-max的随机数
function getRandomNum(Min,Max) {   
    var Range = Max - Min;   
    var Rand = Math.random();   
    return(Min + Math.round(Rand * Range));   
}
// 获取xxx
function getTimes() {
    var nonce = getRandomNum(100000, 999999)
    var timestamp = new Date().getTime()
    var sign = HASH(String(timestamp) + String(nonce) + 'BoChat_APP')

    return {
        nonce,
        timestamp,
        sign
    }
}

function GetRequest() {
    var url = decodeURI(decodeURI(location.search)); //获取url中"?"符后的字串，使用了两次decodeRUI解码
    if(url.indexOf('BoChat') !== -1) {
        var token = localStorage.getItem('token')
        if(token) {
            return {token: token}
        }
    }

    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(strs[i].indexOf('=') + 1));
        }
        localStorage.setItem('token', String(theRequest.token))
        return theRequest;
    }
}

var postData = GetRequest();

service.interceptors.request.use( config => {
    var he = getTimes()
    config.headers.nonce = he.nonce
    config.headers.timestamp = he.timestamp
    config.headers.sign = he.sign
    if(postData) config.headers.Authorization = 'BoChat ' + postData.token

    return config
}, err => {
    Promise.reject(err)
})


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
        Vue.prototype.$http = service;
    }
}