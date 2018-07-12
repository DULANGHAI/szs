<template>
  <el-dialog
    title="新建项目"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="项目名" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="goOK">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { postRepositoryYuyan } from '@/api/script'
  import { Message } from 'element-ui'
  const formData = {
    'name': ''
  }
  export default {
    props: ['group_id'],
    data() {
      return {
        dialogVisible: false,
        versionList: [],
        form: JSON.parse(JSON.stringify(formData)),
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      postRepositoryYuyan
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      },
      goOK() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = () => {
              this.$emit('getList')
              Message.success('操作成功！')
              this.dialogVisible = false
            }
            postRepositoryYuyan(this.form.name, this.$props.group_id).then(response => {
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