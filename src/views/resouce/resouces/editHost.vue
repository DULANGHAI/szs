<template>
  <el-dialog
    title="编辑主机"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog add-host-dig">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-row v-for="(item, index) in form.accounts" :key="index">
        <el-col :span="12">
          <el-form-item label="用户">
            <el-input v-model="item.username" :key="index" disabled size="small" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码">
            <el-input v-model="item.password" :key="index" size="small" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="变量" class="label-border">
            <el-button size="small" @click="addParameters"><i class="el-icon-plus" />添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in form.params" :key="index">
        <el-col :span="10">
          <el-form-item label="字段">
            <el-input v-model="item.name" size="small" auto-complete="off" placeholder="请输入字段"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="变量">
            <el-input v-model="item.value" size="small" auto-complete="off" placeholder="请输入变量"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="text" @click.prevent="removeParameters(item)" style="margin-left:20px">删除</el-button>
        </el-col>
      </el-row> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { putHosts } from '@/api/resouce/resouces/host'
  import { Message } from 'element-ui'

  const formData = {
    'id': '',
    'accounts': [],
    'params': []
  }
  export default {
    props: ['pid'],
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        hostList: [],
        userarry: [],
        isEditId: '',
        marry: [],
        rules: {
          name: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'repository'
      ])
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.isEdit = flag
        if (flag) {
          this.form.accounts = item[0].accounts.map((item) => {
            return { 'username': item.username, 'password': item.password }
          })
          this.form.params = item[0].params.map((item) => {
            return { 'name': item.name, 'value': item.value }
          })
          this.form.id = item[0].id
        }
      },
      // 添加变量
      addParameters() {
        this.form.params.push({
          'name': '',
          'value': ''
        })
      },
      // 删除变量
      removeParameters(item) {
        var index = this.form.params.indexOf(item)
        if (index !== -1) {
          this.form.params.splice(index, 1)
        }
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          var successCallBack = () => {
            this.$emit('getList')
            Message.success('更新成功！')
            this.dialogVisible = false
          }
          const paramsArr = {
            'accounts': this.form.accounts,
            'params': this.form.params
          }
          putHosts(this.form.id, paramsArr).then(response => {
            successCallBack()
          }).catch(error => {
            Message.error(error)
          })
        })
      }
    }
  }
</script>