```javascript
/*** http配置*/
import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import * as types from '../store/types'
import router from '../router'
// axios 配置
axios.defaults.timeout = 100000;
/*axios.defaults.baseURL = global.phpUrl//生产环境*/
axios.defaults.baseURL = '/api'//测试环境
axios.defaults.withCredentials=true

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.data = qs.stringify(config.data);
    /*config.headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    }*/
		config.headers = {
			'Content-Type': 'application/json'
		}
    if (store.state.token) {
      config.headers.Authorization = `${store.state.token}`//es6的模板字符串
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
   if(response.data.code==408 || response.data.code==500){
      router.currentRoute.path !== 'login' &&
      router.replace({
        path: 'login',
        query: { redirect: router.currentRoute.path },
      });
    }
    // console.log(response)
    return response
  },
  error => {
    if (error.response) {
      console.log(error.response.status)
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT);
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.path },
            });
        case 504:
          this.tishi('','网络繁忙，请稍后再试！')
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
);

export default axios

```