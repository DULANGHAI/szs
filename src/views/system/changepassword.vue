<template>
    <div class="page-personal-info">
      <Breadcrumb></Breadcrumb>

      <div class="container-title">
        修改密码
      </div>

      <div class="container-body-wrap">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          style="width: 800px; margin: 0 auto"
          label-width="100px"
          label-position="right"
        >
           <el-form-item label="旧密码" prop="oldpassword">
            <el-input v-model="form.oldpassword" placeholder="输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" placeholder="输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="rePassword">
            <el-input v-model="form.rePassword" placeholder="再次输入新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="submitForm('form')">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { updatepassUserApi } from '@/api/systemManage/system.js'
// import { createUserApi } from '@/api/systemManage/system.js'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'changepassword',
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters([
      'name',
      'token'
    ])
  },
  created() {
    this.form.username = this.name
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      form: {
        username: '',
        name: '',
        password: '',
        rePassword: '',
        oldpassword: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        rePassword: [
          // { required: true, message: "请输入确认密码", trigger: "blur" }
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      var params = {
        password: this.form.oldpassword,
        new_pwd: this.form.password,
        verify_pwd: this.form.rePassword
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatepassUserApi(this.token, params).then(res => {
            this.$router.push({
              name: 'pe-dashboard'
            })
            Message.succes('修改成功')
          }).catch(res => {
            Message.succes('修改失败')
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

<style scoped>
</style>
