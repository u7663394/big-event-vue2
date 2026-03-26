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
          :key="menuRenderKey"
          :default-active="activeMenu"
          :default-openeds="openedMenus"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          @select="handleMenuSelect"
        >
          <template v-for="menu in menuList">
            <el-menu-item
              v-if="!hasChildren(menu)"
              :key="menu.indexPath"
              :index="menu.indexPath"
              style="padding-left:30px;font-size:15px"
            >
              <i :class="menu.icon"></i>
              <span>{{ menu.title }}</span>
            </el-menu-item>
            <el-submenu v-else :key="menu.indexPath" :index="menu.indexPath" style="padding-left: 10px;">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item
                v-for="child in menu.children"
                :key="child.indexPath"
                :index="child.indexPath"
              >
                <i :class="child.icon"></i>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
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
import { getMenusAPI } from '@/api'
import defaultAvatar from '@/assets/images/head.png'

const MENU_FALLBACK_GROUP_MAP = {
  '/art-cate': '2',
  '/art-list': '2',
  '/article/edit': '2',
  '/user-info': '3',
  '/user-avatar': '3',
  '/user-pwd': '3'
}

const USER_COMMAND_TO_PATH = {
  profile: '/user-info',
  avatar: '/user-avatar',
  password: '/user-pwd'
}

const getMenuPayload = (response) => {
  const candidates = [response, response?.data]

  for (const item of candidates) {
    if (Array.isArray(item)) {
      return item
    }
    if (Array.isArray(item?.data)) {
      return item.data
    }
  }

  return []
}

export default {
  name: 'my-layout',
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    },
    activeMenu () {
      if (this.$route.path.startsWith('/article/edit')) {
        return '/art-list'
      }

      return this.$route.path
    },
    openedMenus () {
      const activeGroup = this.findParentMenuIndex(this.activeMenu)

      return activeGroup ? [activeGroup] : []
    },
    displayName () {
      return this.userInfo.nickname || this.userInfo.username || '个人中心'
    },
    displayAvatar () {
      return this.userInfo.user_pic || defaultAvatar
    },
    menuRenderKey () {
      return `${this.activeMenu}-${this.openedMenus.join(',')}`
    }
  },
  async created () {
    if (this.$store.state.user.token && !this.userInfo.id) {
      try {
        await this.$store.dispatch('user/getUserInfoAction')
      } catch (error) {}
    }

    await this.fetchMenuList()
  },
  methods: {
    async fetchMenuList () {
      try {
        const res = await getMenusAPI()
        this.menuList = getMenuPayload(res).filter((item) => item.indexPath !== '/article/edit')
      } catch (error) {
        this.menuList = []
      }
    },
    hasChildren (menu) {
      return Array.isArray(menu.children) && menu.children.length > 0
    },
    findParentMenuIndex (path) {
      const matchedMenu = this.menuList.find((menu) => {
        if (!this.hasChildren(menu)) {
          return false
        }

        return menu.children.some((child) => child.indexPath === path)
      })

      if (matchedMenu) {
        return matchedMenu.indexPath
      }

      return MENU_FALLBACK_GROUP_MAP[path] || ''
    },
    handleMenuSelect (index) {
      if (index === this.activeMenu) {
        return
      }

      this.$router.push(index)
    },
    handleUserCommand (command) {
      this.$router.push(USER_COMMAND_TO_PATH[command] || '/user-info')
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
  overflow-y: auto;

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
