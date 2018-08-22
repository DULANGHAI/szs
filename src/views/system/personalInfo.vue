<template>
    <div class="page-personal-info">
      <Breadcrumb></Breadcrumb>

      <div class="container-title">
        系统配置
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
            <el-input v-model="form.userName" placeholder="输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" placeholder="输入新密码(8位以上包含大小写字母和特殊字符)"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="rePassword">
            <el-input v-model="form.rePassword" placeholder="再次输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="所属业务">
            <el-select v-model="form.business" disabled style="width: 100%" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="微信号" prop="weixin">
            <el-input v-model="form.weixin" placeholder="输入微信号"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="form.role"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"  @click="submitForm('form')">提交</el-button>
            <el-button>保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { createUserApi ,getrolesId} from '@/api/systemManage/system.js'
// import {mapActions,mapGetters} from 'vuex'
// import {mapGetters} from 'vuex'

export default {
  name: 'personalInfo',
  components: {
    Breadcrumb
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
      options: [
        {
          value: 'LDDS',
          label: 'LDDS'
        },
        {
          value: '上证云',
          label: '上证云'
        }
      ],
      form: {
        userName: '',
        password: '',
        rePassword: '',
        name: '',
        business: ['LDDS', '上证云'],
        email: '',
        phone: '',
        weixin: '',
        role: ''
        // user_id:''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        rePassword: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        weixin: [{ required: true, message: '请输入微信号', trigger: 'blur' }]
      }
    }
  },
  // mounted() {
  //   getrolesId().then(res=>{
  //     console.log(res,'111')
  //   }).catch(errot=>{
  //     console.log('22')
  //   })
  // },
  created() {
    // submitForm()
  },
  methods: {
    blur() {
      if (this.form.password === this.form.rePassword) {
        console.log('1')
      } else {
        console.log('2')
      }
    },
    submitForm(formName) {
      const params = {
        username: this.form.userName,
        status: 0,
        role_ids: [3],
        modified_by: this.form.userName,
        realname: this.form.name,
        business: this.form.business[0],
        telephone: this.form.phone,
        wechat: this.form.weixin,
        password: this.form.password,
        email: this.form.email
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          createUserApi(params)
            .then(res => {
              console.log(res)
              // setItem(key,value)
              // localStorage.setItem('user_id',res.user_id);

              //   saveSearch() {
              //     this.saveSearchHistory(res)
              //   },
              //   ...mapActions([
              //   'saveSearchHistory'
              // ])
              // this.$store.dispatch('Res',res);
              this.$router.push({
                name: 'user'
                // query: {res: res},
              })
            })
            .catch(error => {
              console.error(error)
            })
        } else {
          console.log('提交失败!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
