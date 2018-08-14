<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div>{{des}}</div>
      <el-form-item label="" prop="description">
        <el-input v-model="form.description" auto-complete="off" type="textarea" rows="4" maxlength="200" placeholder="请输入提要说明"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'Vuex'
import { approveApi } from '@/api/pe/peApprove'

export default {
  props: {
    refresh: Function
  },
  data() {
    return {
      dialogVisible: false,
      type: '',
      id: '',
      fileList: [],
      form: {
        description: ''
      },
      rules: {
        description: [
          { required: true, message: '说明不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    title() {
      if (this.type === '2') {
        return '审批通过'
      } else if (this.type === '3') {
        return '审批拒绝'
      } else {
        return '标题'
      }
    },
    des() {
      if (this.type === '2') {
        return '确定通过该运维操作吗？'
      } else if (this.type === '3') {
        return '确定拒绝该运维操作吗？'
      } else {
        return '确定该运维操作吗？'
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.type = ''
      this.id = ''
      this.fileList = []
      this.form = {
        description: ''
      }
      this.$refs.ruleForm.resetFields()
    },
    showModel() {
      this.dialogVisible = true
    },
    setData(id, type) {
      this.id = id
      this.type = type
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            'status': this.type,
            'approver': this.name,
            'description': this.form.description
          }

          approveApi(this.id, params).then(() => {
            this.$message.success('操作成功！')
            this.dialogVisible = false
            this.refresh()
          })
        }
      })
    }
  }
}
</script>
