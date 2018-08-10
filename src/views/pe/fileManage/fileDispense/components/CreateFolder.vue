<template>
  <el-dialog
    title="新建目录"
    :visible="dialogVisible"
    width="500px"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="目录名" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createFolderApi } from '@/api/pe/fileManage/fileDispense'

export default {
  props: {
    id: [Number, String],
    path: String,
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
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showModel() {
      this.dialogVisible = true
    },
    handleClose() {
      this.form.name = ''
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            'path': this.path,
            'type': 'tree',
            'name': this.form.name
          }
          createFolderApi(this.id, params).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.refresh()
          })
        }
      })
    }
  }
}
</script>