<template>
  <el-container class="main-container">
    <el-header>
      <img class="header-logo" src="../../assets/images/logo.png" alt="大事件" />
      <div class="header-actions">
        <el-dropdown trigger="click" @command="handleUserCommand">
          <div class="user-profile">
            <img class="avatar" :src="displayAvatar" alt="用户头像" />
            <span>{{ displayName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">基本资料</el-dropdown-item>
            <el-dropdown-item command="avatar">更换头像</el-dropdown-item>
            <el-dropdown-item command="password">重置密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="logout-action" @click="handleLogout">
          <i class="el-icon-switch-button"></i>
          <span>退出</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="user-box">
          <img :src="displayAvatar" alt="用户头像" />
          <span>欢迎 {{ displayName }}</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          :default-openeds="openedMenus"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          @select="handleMenuSelect"
        >
          <el-menu-item index="/home" style="padding-left:30px;font-size:15px">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-submenu index="/article" style="padding-left: 10px;">
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
            <el-menu-item index="/article/edit">
              <i class="el-icon-star-off"></i>
              <span>发表文章</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/user-center" style="padding-left: 10px;">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/user?tab=profile">
              <i class="el-icon-tickets"></i>
              <span>基本资料</span>
            </el-menu-item>
            <el-menu-item index="/user?tab=avatar">
              <i class="el-icon-camera"></i>
              <span>更换头像</span>
            </el-menu-item>
            <el-menu-item index="/user?tab=password">
              <i class="el-icon-lock"></i>
              <span>重置密码</span>
            </el-menu-item>
          </el-submenu>
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
import { MessageBox } from 'element-ui'
import defaultAvatar from '@/assets/images/head.png'

export default {
  name: 'my-layout',
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    },
    activeMenu () {
      if (this.$route.path === '/user') {
        return `/user?tab=${this.$route.query.tab || 'profile'}`
      }

      return this.$route.path
    },
    openedMenus () {
      if (this.$route.path === '/user') {
        return ['/user-center']
      }

      return ['/article']
    },
    displayName () {
      return this.userInfo.nickname || this.userInfo.username || '个人中心'
    },
    displayAvatar () {
      return this.userInfo.user_pic || defaultAvatar
    }
  },
  data () {
    return {

    }
  },
  async created () {
    if (this.$store.state.user.token && !this.userInfo.id) {
      try {
        await this.$store.dispatch('user/getUserInfoAction')
      } catch (error) {}
    }
  },
  methods: {
    handleMenuSelect (index) {
      if (index === this.activeMenu) {
        return
      }

      if (index.startsWith('/user?tab=')) {
        this.$router.push({
          path: '/user',
          query: {
            tab: index.split('=')[1]
          }
        })
        return
      }

      this.$router.push(index)
    },
    handleUserCommand (command) {
      this.$router.push({
        path: '/user',
        query: { tab: command }
      })
    },
    async handleLogout () {
      try {
        await MessageBox.confirm('确定要退出登录吗？', '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
      } catch (error) {
        return
      }

      this.$store.commit('user/logout')
      this.$router.push('/login')
    }
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
  outline: none;
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
  height: 130px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 28px;
  border-bottom: 1px solid #191b20;
  user-select: none;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 16px;
    font-weight: 600;
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
    height: 60px;
    line-height: 60px;
  }

  /deep/ .el-submenu .el-menu-item {
    min-width: 200px;
    padding-left: 54px !important;
    background-color: #2a2d35 !important;
  }

  /deep/ .el-menu-item i,
  /deep/ .el-submenu__title i {
    margin-right: 12px;
    font-size: 22px;
  }

  /deep/ .el-menu-item.is-active {
    background-color: #2f3344 !important;
  }
}
</style>
