import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutPage from '@/views/layout/index.vue'
import ArticleCatePage from '@/views/article/cate.vue'
import ArticleEditPage from '@/views/article/edit.vue'
import ArticleListPage from '@/views/article/list.vue'
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
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: HomePage
        },
        {
          path: '/art-cate',
          component: ArticleCatePage
        },
        {
          path: '/art-list',
          component: ArticleListPage
        },
        {
          path: '/user-info',
          component: UserPage
        },
        {
          path: '/user-avatar',
          component: UserPage
        },
        {
          path: '/user-pwd',
          component: UserPage
        },
        {
          path: '/article/edit/:id?',
          component: ArticleEditPage
        }
      ]
    },
    {
      path: '/article',
      redirect: '/art-cate'
    },
    {
      path: '/article/cate',
      redirect: '/art-cate'
    },
    {
      path: '/article/list',
      redirect: '/art-list'
    },
    {
      path: '/user',
      redirect: (to) => {
        const pathMap = {
          profile: '/user-info',
          avatar: '/user-avatar',
          password: '/user-pwd'
        }

        return pathMap[to.query.tab] || '/user-info'
      }
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
