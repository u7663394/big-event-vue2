<template>
  <div class="user-page">
    <el-card shadow="never" class="user-card">
      <div class="user-card__header">{{ panelTitle }}</div>
      <div class="user-card__body">
        <template v-if="activeTab === 'profile'">
          <el-form
            ref="profileForm"
            :model="profileForm"
            :rules="profileRules"
            label-width="120px"
            class="user-form"
          >
            <el-form-item label="登录名称">
              <el-input :value="userInfo.username || ''" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model.trim="profileForm.nickname"
                maxlength="10"
                placeholder="请输入用户昵称"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
              <el-input
                v-model.trim="profileForm.email"
                placeholder="请输入用户邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="profileLoading" @click="submitProfile">
                提交修改
              </el-button>
              <el-button @click="resetProfileForm">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-else-if="activeTab === 'avatar'">
          <div class="avatar-panel">
            <div class="avatar-panel__preview">
              <img v-if="avatarPreview" class="avatar-panel__image" :src="avatarPreview" alt="头像预览" />
              <span v-else class="avatar-panel__placeholder">请选择头像</span>
            </div>
            <div class="avatar-panel__actions">
              <input
                ref="avatarInput"
                class="avatar-panel__input"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
              />
              <el-button type="primary" @click="triggerAvatarSelect">选择头像</el-button>
              <el-button
                :loading="avatarLoading"
                :disabled="!avatarForm.avatar"
                @click="submitAvatar"
              >
                上传图片
              </el-button>
            </div>
          </div>
        </template>

        <template v-else>
          <el-form
            ref="passwordForm"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="120px"
            class="user-form"
          >
            <el-form-item label="原密码" prop="old_pwd">
              <el-input
                v-model.trim="passwordForm.old_pwd"
                show-password
                placeholder="请输入原密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_pwd">
              <el-input
                v-model.trim="passwordForm.new_pwd"
                show-password
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="re_pwd">
              <el-input
                v-model.trim="passwordForm.re_pwd"
                show-password
                placeholder="请再次输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="passwordLoading" @click="submitPassword">
                修改密码
              </el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import defaultAvatar from '@/assets/images/head.png'
import { updateUserAvatar, updateUserInfo, updateUserPassword } from '@/api/user'

const TAB_LIST = ['profile', 'avatar', 'password']

export default {
  name: 'UserPage',
  data () {
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
        return
      }

      if (!/^\S{6,15}$/.test(value)) {
        callback(new Error('密码长度必须为 6 到 15 位且不能包含空格'))
        return
      }

      if (value === this.passwordForm.old_pwd) {
        callback(new Error('新密码不能与原密码相同'))
        return
      }

      callback()
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
        return
      }

      if (value !== this.passwordForm.new_pwd) {
        callback(new Error('两次输入的新密码不一致'))
        return
      }

      callback()
    }

    return {
      profileLoading: false,
      avatarLoading: false,
      passwordLoading: false,
      profileForm: {
        nickname: '',
        email: ''
      },
      avatarForm: {
        avatar: ''
      },
      avatarPreview: defaultAvatar,
      passwordForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      profileRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '用户昵称长度必须为 2 到 10 位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
        ]
      },
      passwordRules: {
        old_pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须为 6 到 15 位且不能包含空格', trigger: 'blur' }
        ],
        new_pwd: [
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        re_pwd: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    },
    activeTab () {
      const tab = this.$route.query.tab
      return TAB_LIST.includes(tab) ? tab : 'profile'
    },
    panelTitle () {
      const titleMap = {
        profile: '基本资料',
        avatar: '更换头像',
        password: '重置密码'
      }

      return titleMap[this.activeTab]
    }
  },
  watch: {
    '$route.query.tab': {
      immediate: true,
      handler () {
        if (!TAB_LIST.includes(this.$route.query.tab)) {
          this.replaceTab('profile')
        }
      }
    },
    userInfo: {
      immediate: true,
      deep: true,
      handler (value) {
        this.avatarPreview = value.user_pic || defaultAvatar
      }
    }
  },
  async created () {
    if (!this.userInfo.id) {
      try {
        await this.$store.dispatch('user/getUserInfoAction')
      } catch (error) {}
    }
  },
  methods: {
    replaceTab (tab) {
      if (this.$route.query.tab === tab) {
        return
      }

      this.$router.replace({
        path: '/user',
        query: { tab }
      })
    },
    resetProfileForm () {
      this.profileForm.nickname = ''
      this.profileForm.email = ''
      this.$refs.profileForm && this.$refs.profileForm.clearValidate()
    },
    async submitProfile () {
      if (!this.userInfo.id) {
        Message.error('用户信息获取失败，请稍后重试')
        return
      }

      try {
        await this.$refs.profileForm.validate()
      } catch (error) {
        return
      }

      this.profileLoading = true
      try {
        await updateUserInfo({
          id: this.userInfo.id,
          nickname: this.profileForm.nickname,
          email: this.profileForm.email
        })
        this.$store.commit('user/setUserInfo', {
          ...this.userInfo,
          nickname: this.profileForm.nickname,
          email: this.profileForm.email
        })
        Message.success('基本资料修改成功')
      } finally {
        this.profileLoading = false
      }
    },
    triggerAvatarSelect () {
      this.$refs.avatarInput.click()
    },
    handleAvatarChange (event) {
      const [file] = event.target.files || []

      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        this.avatarForm.avatar = reader.result
        this.avatarPreview = reader.result
      }
      reader.readAsDataURL(file)
      event.target.value = ''
    },
    async submitAvatar () {
      if (!this.avatarForm.avatar) {
        Message.warning('请先选择头像图片')
        return
      }

      this.avatarLoading = true
      try {
        await updateUserAvatar(this.avatarForm.avatar)
        this.$store.commit('user/setUserInfo', {
          ...this.userInfo,
          user_pic: this.avatarForm.avatar
        })
        Message.success('头像更新成功')
      } finally {
        this.avatarLoading = false
      }
    },
    resetPasswordForm () {
      this.$refs.passwordForm && this.$refs.passwordForm.resetFields()
    },
    async submitPassword () {
      try {
        await this.$refs.passwordForm.validate()
      } catch (error) {
        return
      }

      this.passwordLoading = true
      try {
        await updateUserPassword(this.passwordForm)
        Message.success('密码重置成功')
        this.resetPasswordForm()
      } finally {
        this.passwordLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-page {
  min-height: 100%;
}

.user-card {
  border: none;
  border-radius: 6px;
  overflow: hidden;
}

.user-card__header {
  height: 92px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  border-bottom: 1px solid #ebeef5;
  font-size: 22px;
  font-weight: 700;
  color: #222733;
}

.user-card__body {
  min-height: 360px;
  padding: 34px 42px 40px;
}

.user-form {
  width: 700px;
}

.avatar-panel {
  padding-top: 8px;
}

.avatar-panel__preview {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  overflow: hidden;
}

.avatar-panel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-panel__placeholder {
  color: #b5b8bf;
  font-size: 18px;
  font-weight: 600;
}

.avatar-panel__actions {
  margin-top: 28px;
}

.avatar-panel__actions .el-button + .el-button {
  margin-left: 12px;
}

.avatar-panel__input {
  display: none;
}

/deep/ .el-form-item {
  margin-bottom: 28px;
}

/deep/ .el-form-item__label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/deep/ .el-input__inner {
  height: 54px;
  line-height: 54px;
  font-size: 16px;
}

/deep/ .el-button {
  min-width: 96px;
  height: 44px;
  padding: 0 24px;
  font-size: 16px;
}
</style>
