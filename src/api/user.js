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

// 3. 获取用户基本资料
export const getUserInfo = () => {
  return request.get('/my/userinfo')
}

// 4. 更新用户基本资料
export const updateUserInfo = (data) => {
  return request.put('/my/userinfo', {
    id: data.id,
    nickname: data.nickname,
    email: data.email
  })
}

// 5. 更新用户头像
export const updateUserAvatar = (avatar) => {
  return request.patch('/my/update/avatar', {
    avatar
  })
}

// 6. 更新用户密码
export const updateUserPassword = (data) => {
  return request.patch('/my/updatepwd', {
    old_pwd: data.old_pwd,
    new_pwd: data.new_pwd,
    re_pwd: data.re_pwd
  })
}
