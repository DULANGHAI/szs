<template>
  <el-dialog
    :title="type === 'tree' ? '新建文件夹' : '新建文件' "
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item :label="type === 'tree' ? '文件夹名称' : '文件名称' " prop="name">
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
  import { putAppFile, postAppFile } from '@/api/script'
  import { Message } from 'element-ui'

  const formData = {
    'name': ''
  }
  export default {
    props: ['project_id', 'filePath', 'branch'],
    data() {
      return {
        dialogVisible: false,
        versionList: [],
        type: 'tree',
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        rules: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doCreate(flag, directory, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.type = directory
        this.isEdit = flag
        if (flag) {
          this.form.name = item.name
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = () => {
              this.$emit('getfilelist')
              Message.success('添加成功！')
              this.dialogVisible = false
            }
            if (this.isEdit) {
              const params = {
                'path': this.$props.filePath,
                'type': this.type,
                'name': this.form.name,
                'branch': this.$props.branch
              }
              putAppFile(this.$props.project_id, params).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            } else {
              const params = {
                'path': this.$props.filePath,
                'type': this.type,
                'name': this.form.name,
                'branch': this.$props.branch
              }
              postAppFile(this.$props.project_id, params).then(response => {
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