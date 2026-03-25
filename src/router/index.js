import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutPage from '@/views/layout/index.vue'
import ArticlePage from '@/views/article/index.vue'
import HomePage from '@/views/home/index.vue'
import LoginPage from '@/views/login/index.vue'
import RegisterPage from '@/views/register/index.vue'
import UserPage from '@/views/user/index.vue'
import { getToken } from '@/utils/storage'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/layout',
      component: LayoutPage,
      children: [
        {
          path: '/home',
          component: HomePage
        },
        {
          path: '/article',
          component: ArticlePage
        },
        {
          path: '/user',
          component: UserPage
        }
      ]
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
  const token = getToken()

  if (token || whiteList.includes(to.path)) {
    next()
    return
  }

  next('/login')
})

export default router
