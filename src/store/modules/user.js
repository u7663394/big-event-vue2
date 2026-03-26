// User 相关 Vuex 模块
import { getAuthToken, getUserInfo, login, register } from '@/api/user'
import { delToken, getToken, setToken } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      token: getToken() || '',
      userInfo: {}
    }
  },
  mutations: {
    setUserToken (state, newToken) {
      // 1. 存入 vuex
      state.token = newToken
      // 2. 存入 localStorage
      setToken(newToken)
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo || {}
    },
    logout (state) {
      state.token = ''
      state.userInfo = {}
      delToken()
    }
  },
  actions: {
    async registerAction (context, form) {
      await register(form)
    },
    async loginAction (context, form) {
      // 1. 发送登陆请求
      const res = await login(form)
      const token = getAuthToken(res)
      if (!token) {
        throw new Error('LOGIN_TOKEN_MISSING')
      }
      // 2. 调用 mutation 存 token
      context.commit('setUserToken', token)
    },
    async getUserInfoAction (context) {
      const res = await getUserInfo()
      const userInfo = res.data || res
      context.commit('setUserInfo', userInfo)
      return userInfo
    }
  },
  getters: {}
}
