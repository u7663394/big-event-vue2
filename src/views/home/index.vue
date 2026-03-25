<template>
  <section class="home-page">
    <div class="home-card">
      <h1 class="home-title">欢迎进入大事件首页</h1>
      <p class="home-desc">注册与登录流程已完成，这里是当前版本的登录落点页。</p>
      <el-button type="primary" @click="logout">测试退出登录</el-button>
    </div>
  </section>
</template>

<script>
import { delToken } from '@/utils/storage'

export default {
  name: 'HomePage',
  methods: {
    logout () {
      delToken()
      this.$message.success('已退出登录')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%);
}

.home-card {
  width: 100%;
  max-width: 520px;
  padding: 48px 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(61, 96, 172, 0.12);
  text-align: center;
}

.home-title {
  margin: 0;
  color: #1d2433;
  font-size: 30px;
}

.home-desc {
  margin: 18px 0 30px;
  color: #5a6476;
  font-size: 16px;
  line-height: 1.7;
}
</style>
