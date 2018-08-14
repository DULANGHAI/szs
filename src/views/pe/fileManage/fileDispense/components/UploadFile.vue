<template>
  <el-dialog
    title="上传文件"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div>上传文件(单个文件大小不超过500mb)</div>
      <el-upload
        drag
        :action="uploadAction()"
        :on-remove="handleRemove"
        :onSuccess="uploadSuccess"
        :onError="uploadError"
        :before-upload="beforeAvatarUpload"
        :before-remove="beforeRemove"
        :file-list="fileList"
        multiple>
        <i class="el-icon-plus"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      </el-upload>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="form.comment" auto-complete="off" placeholder="请输入提要说明"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadFileApi } from '@/api/pe/fileManage/fileDispense'

export default {
  props: {
    id: [Number, String],
    path: String,
    refresh: Function
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      form: {
        comment: ''
      },
      beforeUpload: true,
      rules: {
        comment: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.fileList = []
      this.form = {
        comment: ''
      }
      this.beforeUpload = true
    },
    showModel() {
      this.dialogVisible = true
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var fileArray = this.fileList
          var files = []
          for (var i in fileArray) {
            files.push({
              'server_path': fileArray[i].response.server_path,
              'name': fileArray[i].response.name
            })
          }

          const params = {
            'files': files,
            'path': this.path,
            'comment': this.form.comment,
            'risk_level': 0,
            'branch': 'master',
            'repository_type': 'file_buckets'
          }

          uploadFileApi(this.id, params).then(() => {
            this.$message.success('添加成功！')
            this.dialogVisible = false
            this.refresh()
          })
        }
      })
    },
    uploadAction() {
      return '/v1/repositories/project/' + this.id + '/files/upload'
    },
    // 移除上传文件列表
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    // 上传错误
    uploadError(response, file, fileList) {
      this.$message.error('上传失败，请重试！')
    },
    // 上传文件大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      this.beforeUpload = true
      if (!isLt2M) {
        this.beforeUpload = false
        this.$message.error('上传文件大小不能超过 500MB!')
      }
      return isLt2M
    },
    // 移除上传文件列表
    beforeRemove(file, fileList) {
      if (this.beforeUpload) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    }
  }
}
</script>
