// 封装本地存储模块
const KEY = 'my-token-big-event'
const INVALID_TOKEN_VALUES = ['undefined', 'null', '']

const normalizeToken = (token) => {
  if (typeof token !== 'string') {
    return ''
  }

  const normalizedToken = token.trim()

  if (INVALID_TOKEN_VALUES.includes(normalizedToken)) {
    return ''
  }

  return normalizedToken
}

// 1. 获取 token
export const getToken = () => {
  const token = normalizeToken(localStorage.getItem(KEY))

  if (!token) {
    localStorage.removeItem(KEY)
  }

  return token
}

// 2. 设置 token
export const setToken = (newToken) => {
  const token = normalizeToken(newToken)

  if (!token) {
    localStorage.removeItem(KEY)
    return
  }

  localStorage.setItem(KEY, token)
}

// 3. 删除 token
export const delToken = () => {
  localStorage.removeItem(KEY)
}
