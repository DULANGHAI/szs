<template>
  <el-dialog
    :title="!isEdit ? '添加角色' : '编辑角色' "
    :visible.sync="dialogVisible"
    width="35%"
    top="5%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" label-width="80px" size="small"  ref="ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码">
          <template slot="append"><el-button @click.native="createPassword(8)">随机生成</el-button></template>
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="form.realname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="所属业务" prop="business_ids">
        <el-select v-model="form.business_ids" multiple :style="{width: '100%'}" placeholder="请选择">
          <el-option
            v-for="item in businessOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="form.telephone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="微信号" prop="wechat">
        <el-input v-model="form.wechat" placeholder="请输入微信号"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_ids">
        <el-select v-model="form.role_ids" :style="{width: '100%'}" multiple placeholder="请选择">
          <el-option
            v-for="item in rolesOptions"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createUserApi, editUserApi, getBusinessesList, getRolesAll } from '@/api/systemManage/system.js'
  import { Message } from 'element-ui'
  import { validateEmail, validatePhone, validatePwdZf } from '@/utils/validate'

  const formData = {
    'username': '',
    'password': '',
    'realname': '',
    'business_ids': [],
    'email': '',
    'telephone': '',
    'wechat': '',
    'role_ids': [],
    'status': false
  }
  export default {
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        isEditId: '',
        businessOptions: [],
        rolesOptions: [],
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { validator: validatePwdZf, trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          business_ids: [
            { required: true, message: '所属业务不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          role_ids: [
            { required: true, message: '角色不能为空', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.isEdit = flag
        this.getBusiness()
        this.onRolesAll()
        if (flag) {
          this.form = {
            'username': item.username,
            'password': item.password,
            'realname': item.realname,
            'business_ids': item.business_ids || [],
            'email': item.email,
            'telephone': item.telephone,
            'wechat': item.wechat,
            'role_ids': item.role_ids || [],
            'status': item.status !== 0
          }
          this.isEditId = item.id
        }
      },
      getBusiness() {
        getBusinessesList().then(res => {
          this.businessOptions = res
        }).catch(error => {
          Message.error(error)
        })
      },
      onRolesAll() {
        getRolesAll().then(res => {
          this.rolesOptions = res
        }).catch(error => {
          Message.error(error)
        })
      },
      createPassword(len) {
        var pwd = ''
        var numArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        var zfArr = ['/', '!', '@', '#', '%', '_', '+', '~']
        var dxArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        pwd += numArr[Math.round(Math.random() * (numArr.length - 1))]
        pwd += zfArr[Math.round(Math.random() * (zfArr.length - 1))]
        for (var idx = 0; idx < len - 3; idx++) {
          var pos = Math.round(Math.random() * (arr.length - 1))
          pwd += arr[pos]
        }
        pwd += dxArr[Math.round(Math.random() * (dxArr.length - 1))]
        this.form.password = pwd
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = () => {
              this.$emit('getList')
              Message.success(!this.isEdit ? '添加成功！' : '更新成功！')
              this.dialogVisible = false
            }
            if (!this.isEdit) {
              const params = {
                'username': this.form.username,
                'password': this.form.password,
                'realname': this.form.realname,
                'business_ids': this.form.business_ids,
                'email': this.form.email,
                'telephone': this.form.telephone,
                'wechat': this.form.wechat,
                'role_ids': this.form.role_ids,
                'status': this.form.status ? 1 : 0
              }
              createUserApi(params).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            } else {
              const params = {
                'username': this.form.username,
                'password': this.form.password,
                'realname': this.form.realname,
                'business_ids': this.form.business_ids,
                'email': this.form.email,
                'telephone': this.form.telephone,
                'wechat': this.form.wechat,
                'role_ids': this.form.role_ids,
                'status': this.form.status ? 1 : 0
              }
              editUserApi(this.isEditId, params).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            }
          }
        })
      }
    }
  }
</script>