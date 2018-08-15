<template>
  <el-dialog
    title="复制任务"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createTaskApi } from '@/api/pe/taskManage/taskList'

export default {
  props: {
    data: Object,
    refresh: Function
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '任务名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showModel() {
      this.dialogVisible = true
    },
    handleClose() {
      this.form = {
        name: ''
      }
      this.$refs.ruleForm.resetFields()
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            name: this.form.name,
            description: this.data.description,
            type: this.data.type,
            target_system: this.data.target_system,
            language: this.data.language,
            command: this.data.command,

            script: this.data.script,
            script_parameter: this.data.script_parameter,
            script_version: this.data.script_version,

            file_selection: this.data.file_selection,
            file_owner: this.data.file_owner,
            file_permission: this.data.file_permission,
            is_replace: this.data.is_replace,

            time_out: this.data.time_out,
            risk_level: this.data.risk_level,
            risk_statement: this.data.risk_statement,
            is_enable: this.data.is_enable
          }
          createTaskApi(data).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
            this.refresh()
            this.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>
