<template>
  <el-dialog
    title="上传文件"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div>上传文件(单个文件大小不超过500mb)</div>
      <el-upload
        class="upload-demo"
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
      <el-form-item label="提要说明" prop="comment">
        <el-input v-model="form.comment" auto-complete="off" placeholder="请输入提要说明"></el-input>
      </el-form-item>
      <el-form-item label="自评风险" prop="risk_level">
        <el-select v-model="form.risk_level" placeholder="请选择">
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
  import { uploadAppFile } from '@/api/script'
  import { Message } from 'element-ui'

  const formData = {
    comment: '',
    risk_level: ''
  }
  export default {
    props: ['project_id', 'branch', 'path'],
    data() {
      return {
        dialogVisible: false,
        fileList: [],
        levelOptions: [{
          label: '低风险',
          value: 1
        }, {
          label: '中风险',
          value: 2
        }, {
          label: '高风险',
          value: 3
        }],
        form: {
          name: ''
        },
        beforeUpload: true,
        rules: {
          comment: [
            { required: true, message: '提要说明不能为空', trigger: 'blur' }
          ],
          risk_level: [
            { required: true, message: '自评风险不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.fileList = []
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      // 上传成功后的回调
      uploadSuccess(response, file, fileList) {
        // console.log('上传文件', response, file, fileList)
        if (response.IsSuccess) {
          this.fileList = fileList
          Message.success('上传成功！')
        } else {
          Message.error('上传失败，请重试！')
        }
      },
      // 移除上传文件列表
      handleRemove(file, fileList) {
        // console.log(fileList)
        this.fileList = fileList
      },
      // 上传文件大小
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 500
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
      },
      // 上传错误
      uploadError(response, file, fileList) {
        console.log('上传失败，请重试！')
      },
      uploadAction() {
        return '/v1/repositories/project/' + this.$props.project_id + '/files/upload'
      },
      // 提交
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

            var successCallBack = () => {
              this.$emit('getfilelist')
              Message.success('添加成功！')
              this.dialogVisible = false
            }

            const params = {
              'files': files,
              'path': this.$props.path,
              'comment': this.form.comment,
              'risk_level': this.form.risk_level,
              'branch': this.$props.branch,
              'repository_type': 'configurations'
            }

            uploadAppFile(this.$props.project_id, params).then(response => {
              successCallBack()
            }).catch(error => {
              Message.error(error)
            })
          }
        })
      }
    }
  }
</script>