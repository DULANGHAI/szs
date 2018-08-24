<template>
    <div class="page-personal-info">
      <Breadcrumb></Breadcrumb>

      <div class="container-title">
        个人信息
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
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.username" disabled placeholder="输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.realname" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="所属业务">
            <el-select v-model="form.business_ids" disabled style="width: 100%" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.telephone" placeholder="输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="微信号" prop="weixin">
            <el-input v-model="form.wechat" placeholder="输入微信号"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="form.role_ids" disabled style="width: 100%" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用" prop="status">
            <el-switch
              v-model="form.status">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="submitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { editUserApi, getUserInfo } from '@/api/systemManage/system.js'
import { Message } from 'element-ui'
// import {mapActions,mapGetters} from 'vuex'
import { mapGetters } from 'vuex'

var formData = {
  'username': '',
  'realname': '',
  'business_ids': [],
  'email': '',
  'telephone': '',
  'wechat': '',
  'role_ids': [],
  'status': false
}
export default {
  name: 'personalInfo',
  components: {
    Breadcrumb
  },
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.form.password) {
    //     callback(new Error('两次输入密码不一致!'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      form: JSON.parse(JSON.stringify(formData)),
      options: [],
      rules: {
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        // rePassword: [
        //   { required: true, trigger: 'blur', validator: validatePass }
        // ],
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        wechat: [{ required: true, message: '请输入微信号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'token'
    ])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getUserInfo(this.token).then(res => {
        this.form = {
          'username': res.username,
          'realname': res.realname,
          'business_ids': res.business_ids,
          'email': res.email,
          'telephone': res.telephone,
          'wechat': res.wechat,
          'role_ids': res.role_ids,
          'status': res.status !== 0
        }
      }).catch(error => {
        Message.error(error)
      })
    },
    submitForm(formName) {
      const params = {
        'username': this.form.username,
        'realname': this.form.realname,
        'business_ids': this.form.business_ids,
        'email': this.form.email,
        'telephone': this.form.telephone,
        'wechat': this.form.wechat,
        'role_ids': this.form.role_ids,
        'status': this.form.status ? 1 : 0
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUserApi(this.token, params)
            .then(res => {
              this.$router.push({
                name: 'user'
              })
            })
            .catch(error => {
              Message.error(error)
            })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
