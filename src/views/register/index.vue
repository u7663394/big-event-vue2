<template>
  <!-- 注册页整体容器 -->
  <section class="auth-page">
    <!-- 左上角品牌 logo -->
    <div class="brand">
      <img src="@/assets/images/logo.png" class="brand-logo">
    </div>
    <!-- 注册卡片区域 -->
    <main class="register-card">
      <div class="register-card_inner">
        <div class="register-card_header">
          <h1 class="register-card_title">后台管理系统</h1>
          <button class="switch-btn" type="button" @click="goLogin">
            去登录
          </button>
        </div>
        <!-- 注册表单 -->
        <el-form
          :model="formModel"
          :rules="rules"
          label-position="top"
          class="register-form"
          @submit.native.prevent
          ref="form"
        >
          <el-form-item label="用户名" class="register-form_item" prop="username">
            <el-input
              v-model="formModel.username"
              placeholder="请输入用户名"
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item label="密码" class="register-form_item" prop="password">
            <el-input
              v-model="formModel.password"
              placeholder="请输入密码"
              show-password
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" class="register-form_item" prop="repassword">
            <el-input
              v-model="formModel.repassword"
              placeholder="请再次输入密码"
              show-password
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item class="register-form_action">
            <el-button class="submit-btn" type="primary" :loading="loading" @click="register">
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </section>
</template>

<script>
import { register } from '@/api/user'

export default {
  name: 'RegisterPage',
  data () {
    const validateRepassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
        return
      }

      if (value !== this.formModel.password) {
        callback(new Error('两次输入的密码不一致'))
        return
      }

      callback()
    }

    return {
      formModel: {
        username: '',
        password: '',
        repassword: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        repassword: [
          { validator: validateRepassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goLogin () {
      this.$router.push('/login')
    },
    async register () {
      try {
        await this.$refs.form.validate()
        this.loading = true
        await register(this.formModel)
        this.$message.success('注册成功')
        this.$router.push({
          path: '/login',
          query: {
            username: this.formModel.username
          }
        })
      } catch (error) {
        if (error) {
          console.log(error)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: url('@/assets/images/登录注册bg@2x.png') center center / cover no-repeat;
}

.brand {
  position: absolute;
  top: 32px;
  left: 54px;
  z-index: 3;
}

.brand-logo {
  display: block;
  width: 146px;
  height: auto;
}

.register-card {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 108px 24px 48px;
}

.register-card_inner {
  width: 100%;
  max-width: 542px;
  padding: 54px 60px 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(60, 88, 138, 0.08);
  backdrop-filter: blur(14px);
}

.register-card_header {
  text-align: center;
}

.register-card_title {
  margin: 0;
  color: #1d2433;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 2px;
}

.switch-btn {
  margin-top: 16px;
  border: 0;
  background: transparent;
  color: #3b82f6;
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.22s ease, transform 0.22s ease;

  &:hover {
    color: #7aa5ff;
    transform: translateY(-1px);
  }
}

.register-form {
  margin-top: 44px;
}

.register-form_item {
  margin-bottom: 22px;
}

.register-form_action {
  margin-bottom: 0;
  padding-top: 2px;
}

.submit-btn {
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 4px;
  background: #5a84f6;
  box-shadow: 0 10px 24px rgba(90, 132, 246, 0.22);
  font-size: 22px;
  letter-spacing: 4px;
  transition: background-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;

  &:hover,
  &:focus {
    background: #7c9efe;
    box-shadow: 0 14px 28px rgba(90, 132, 246, 0.28);
    transform: translateY(-1px);
  }
}

::v-deep .el-form-item__label {
  padding-bottom: 8px;
  color: #5a6476;
  font-size: 16px;
  line-height: 1.2;
}

::v-deep .el-input__inner {
  height: 48px;
  border: 1px solid #d7dfeb;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.86);
  color: #1d2433;
  font-size: 16px;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}

::v-deep .el-input__inner::placeholder {
  color: #bac3d3;
}

::v-deep .el-input__inner:hover,
::v-deep .el-input__inner:focus {
  border-color: #9bb7ff;
  box-shadow: 0 0 0 4px rgba(90, 132, 246, 0.08);
}

::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
}
</style>
