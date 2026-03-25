<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />

      <!-- 右侧的菜单 -->

        <!-- 个人中心 -->

        <!-- 退出登录 -->

    </el-header>
    <el-container>
      <!-- 左侧边栏的用户信息 -->
      <el-aside width="200px">
        <div class="user-box">
          <img src="../../assets/images/head.png" alt=""  />
          <span>欢迎用户</span>
        </div>
        <!-- 左侧导航菜单 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <el-menu-item index="/home" style="padding-left:35px;font-size:15px">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/article" style="padding-left:35px;font-size:15px">
            <i class="el-icon-document"></i>
            <span>文章管理</span>
          </el-menu-item>
          <el-menu-item index="/user" style="padding-left:35px;font-size:15px">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 页面主体区域 -->
        <!-- 二级路由挂载点 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.xxx.com - Guochen Wang</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'my-layout',
  computed: {
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100vh;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    height: 60px !important;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-container {
    min-height: 0;
  }
  .el-main {
    overflow-y: auto;
    height: 0;
    padding: 20px;
    background-color: #f2f2f2;
  }
  .el-footer {
    height: 40px !important;
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  overflow: hidden;
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
