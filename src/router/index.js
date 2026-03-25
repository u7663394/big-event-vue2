import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/home/index.vue'
import LoginPage from '@/views/login/index.vue'
import RegisterPage from '@/views/register/index.vue'
import { getToken } from '@/utils/storage'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: HomePage
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/register',
      component: RegisterPage
    }
  ]
})

// 全局访问拦截
const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
  // 1. 有 token 就放行
  const token = getToken()
  if (token) return next()
  // 2. 去白名单也放行
  if (whiteList.includes(to.path)) return next()
  // 3. 否则，拦截到登陆页
  return next('/login')
})

export default router
