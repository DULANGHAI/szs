<template>
  <el-dialog
    title="复制流程"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="流程名称" prop="name">
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
import { createFlowApi } from '@/api/pe/flowManage/flowList'

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
          { required: true, message: '流程名不能为空', trigger: 'blur' }
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
            'status': this.data.status,
            'has_manual_job': this.data.has_manual_job,
            'job_id_list': this.data.job_id_list,
            'scheduling': this.data.scheduling,
            'description': this.data.description
          }
          createFlowApi(data).then(res => {
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
