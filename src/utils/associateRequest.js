import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vue from 'vue'
// create an axios instance
const service = axios.create({
  baseURL: "http://192.168.59.8:6002", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Cache-Control': 'no-cache'
  }
})
Vue.prototype.$axios = service

window.axios = service
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (/get/i.test(config.method)) { //判断get请求
      config.params  =  config.params || {};
      config.params.timeStr = Date.parse(new Date())/1000; //添加时间戳
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const status = Number(response.status) || 200
    const res = response.data
    if (status !== 200 || res.code == 1) {
      // Message({
      //   message: res.message || '请求失败',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log(res)
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
