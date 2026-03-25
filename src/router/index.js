import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/login/index.vue'
import RegisterPage from '@/views/register/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
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

const router = new VueRouter({
  routes
})

export default router
