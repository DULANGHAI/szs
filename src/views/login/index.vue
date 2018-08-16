<template>
  <div  class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title">
        <svg-icon icon-class="logo" :style="{ transform: 'scale(2.9)', marginRight: '14px', marginBottom: '3px' }"/>
        <span>上证信息运维自动化平台</span>
      </div>
      <div class="tips" style="text-align:center;">
        美好的一天，从现在开始
      </div>
      <el-form-item prop="username">
        <el-input
          placeholder="用户名"
          v-model="loginForm.username"
          autoComplete="on" 
          name="username" >
          <svg-icon slot="prefix" icon-class="user"></svg-icon>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="密码"
          :type="pwdType"
          v-model="loginForm.password"
          autoComplete="on" 
          @keyup.enter.native="handleLogin"
          name="username" >
          <svg-icon slot="prefix" icon-class="password"></svg-icon>
        </el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <div style="text-align:right;margin-bottom: 15px;" >
        <el-checkbox v-model="checked">自动登录</el-checkbox>
      </div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
    </el-form>
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="4"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePass = (rule, value, callback) => {
    //   if (value.length < 5) {
    //     callback(new Error('密码不能小于5位'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      checked: false,
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#FAFFBD;
$light_gray:#000;

/* reset element-ui css */
.login-container {
  .el-input__prefix{
    left: 15px;
    top: 4px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    input {
      background: transparent;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 40px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: rgb(0, 0, 0) !important;
      }
    }
  }
  .el-form-item {
    background: rgb(255, 255, 255);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#F0F3F7;
$dark_gray:#889aa4;
$light_gray:#242424;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 30px auto;
    text-align: center;
    font-weight: bold;
  }
  .tips{
    font-size: 18px;
    margin: 40px 10px;
    color: #848688;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 5px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
