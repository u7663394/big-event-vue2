import axios from 'axios'

export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL
})

// 定义请求拦截器
myAxios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) { // 无效的 token

  }
  return Promise.reject(error)
})

export default myAxios
