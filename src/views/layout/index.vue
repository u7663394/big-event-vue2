<template>
  <el-container class="main-container">
    <el-header>
      <img class="header-logo" src="../../assets/images/logo.png" alt="大事件" />
      <div class="header-actions">
        <el-dropdown trigger="click">
          <div class="user-profile">
            <img class="avatar" src="../../assets/images/avatar.jpg" alt="用户头像" />
            <span>个人中心</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>基本资料</el-dropdown-item>
            <el-dropdown-item>更换头像</el-dropdown-item>
            <el-dropdown-item>重置密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="logout-action">
          <i class="el-icon-switch-button"></i>
          <span>退出</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="user-box">
          <img src="../../assets/images/head.png" alt="用户头像" />
          <span>欢迎 admin</span>
        </div>
        <el-menu
          :default-active="$route.path"
          :default-openeds="['/article']"
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
          <el-submenu index="/article">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item index="/article/cate">
              <i class="el-icon-s-operation"></i>
              <span>文章分类</span>
            </el-menu-item>
            <el-menu-item index="/article/list">
              <i class="el-icon-tickets"></i>
              <span>文章列表</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/user" style="padding-left:35px;font-size:15px">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
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
    border-bottom: 1px solid #1a1d23;
  }

  .el-container {
    min-height: 0;
  }

  .el-main {
    overflow-y: auto;
    height: 0;
    padding: 16px 20px;
    background-color: #f4f5f9;
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

.header-logo {
  height: 60px;
}

.header-actions {
  display: flex;
  align-items: center;
  padding-right: 24px;
  color: #fff;
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

.user-profile {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.logout-action {
  display: flex;
  align-items: center;
  margin-left: 28px;
  color: #fff;
  cursor: pointer;
  user-select: none;

  i {
    margin-right: 6px;
    font-size: 18px;
  }
}

.user-box {
  height: 85px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 28px;
  border-top: 1px solid #191b20;
  border-bottom: 1px solid #191b20;
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
    font-size: 14px;
  }
}

.el-aside {
  overflow: hidden;

  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }

  /deep/ .el-submenu__title,
  /deep/ .el-menu-item {
    font-size: 15px;
  }

  /deep/ .el-submenu .el-menu-item {
    min-width: 200px;
    padding-left: 54px !important;
    background-color: #2a2d35 !important;
  }
}
</style>
