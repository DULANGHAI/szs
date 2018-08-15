<template>
  <el-dialog
    title="复制作业"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="作业名称" prop="name">
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
import { createJobApi } from '@/api/pe/jobManage/jobList'

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
          { required: true, message: '作业名不能为空', trigger: 'blur' }
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
            execution_account: this.data.execution_account,
            target_ip: this.data.target_ip.split(','),
            frequency: this.data.frequency,
            system_type: this.data.system_type,
            job_type: this.data.job_type,
            applications: this.data.applications,
            status: this.data.status,
            scheduling: this.data.scheduling,
            task_id_list: this.data.task_id_list.split(',')
          }
          createJobApi(data).then(res => {
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
