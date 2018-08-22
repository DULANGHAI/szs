<template>
  <el-dialog
    :title="!isEdit ? '添加角色' : '编辑角色' "
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="角色" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入命令白名单"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createRoles, putRoles } from '@/api/systemManage/system.js'
  import { Message } from 'element-ui'

  const formData = {
    'name': '',
    'description': ''
  }
  export default {
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        isEditId: '',
        rules: {
          name: [
            { required: true, message: '角色不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
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
        if (flag) {
          this.form = item
          this.isEditId = item.id
        }
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
                'name': this.form.name,
                'description': this.form.description
              }
              createRoles(params).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            } else {
              const params = {
                'name': this.form.name,
                'description': this.form.description
              }
              putRoles(this.isEditId, params).then(response => {
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