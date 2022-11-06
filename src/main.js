import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/global.less' // 全局初始化样式
import '@/elementUI' // 注册elementUI组件

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
