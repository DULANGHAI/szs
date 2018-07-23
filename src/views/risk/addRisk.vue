<template>
  <el-dialog
    :title="!isEdit ? '新建风险命令' : '编辑风险命令' "
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="命令" prop="name">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入命令"></el-input>
      </el-form-item>
      <el-form-item label="风险" prop="risk_level">
        <el-select v-model="form.risk_level" placeholder="请选择版本">
          <el-option
            v-for="item in levelOptions"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input type="textarea" v-model="form.comment" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addRisk, putRisk } from '@/api/resouce/versionLibrary/risk'
  import { Message } from 'element-ui'

  const formData = {
    'name': '',
    'risk_level': '',
    'comment': ''
  }
  export default {
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        levelOptions: [{
          label: '低危',
          value: 1
        }, {
          label: '中危',
          value: 2
        }, {
          label: '高危',
          value: 3
        }],
        isEditId: '',
        rules: {
          name: [
            { required: true, message: '命令不能为空', trigger: 'blur' }
          ],
          risk_level: [
            { required: true, message: '风险不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.isEdit = flag
        if (flag) {
          this.form = item
          this.isEditId = item.id
        }
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = () => {
              this.$emit('getList')
              Message.success(!this.isEdit ? '添加成功！' : '更新成功！')
              this.dialogVisible = false
            }
            if (!this.isEdit) {
              const params = {
                'name': this.form.name,
                'risk_level': this.form.risk_level,
                'comment': this.form.comment
              }
              addRisk(params).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            } else {
              const params = {
                'name': this.form.name,
                'risk_level': this.form.risk_level,
                'comment': this.form.comment
              }
              putRisk(this.isEditId, params).then(response => {
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