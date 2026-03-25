// 用户相关API
import request from '@/utils/request'

export const getAuthToken = (responseData) => {
  const rawToken = responseData?.token || responseData?.data?.token

  if (typeof rawToken !== 'string') {
    return ''
  }

  const token = rawToken.trim()

  if (!token || token === 'undefined' || token === 'null') {
    return ''
  }

  return token
}

// 1. 注册请求
export const register = (form) => {
  return request.post('/api/reg', {
    username: form.username,
    password: form.password,
    repassword: form.repassword
  })
}

// 2. 登陆请求
export const login = (form) => {
  return request.post('/api/login', {
    username: form.username,
    password: form.password
  })
}
