<template>
  <el-dialog
    title="新建版本"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="版本名称" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入版本名称"></el-input>
      </el-form-item>
      <el-form-item label="选择版本复制（选填）">
        <el-select v-model="form.branch" placeholder="请选择版本">
          <el-option
            v-for="item in branchOptions"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { postBranch } from '@/api/script'
  import { Message } from 'element-ui'

  const formData = {
    'name': '',
    'branch': ''
  }
  export default {
    props: ['branch', 'project_id'],
    data() {
      return {
        form: JSON.parse(JSON.stringify(formData)),
        dialogVisible: false,
        versionList: [],
        branchOptions: [],
        rules: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.branchOptions = this.$props.branch
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = (name) => {
              this.$emit('getfilelist', name)
              Message.success('添加成功！')
              this.dialogVisible = false
            }
            var params = {
              'name': this.form.name,
              'copy_from': this.form.branch
            }
            postBranch(this.$props.project_id, params).then(response => {
              successCallBack(response.name)
            }).catch(error => {
              Message.error(error)
            })
          }
        })
      }
    }
  }
</script>