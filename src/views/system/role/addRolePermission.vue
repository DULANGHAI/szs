<template>
  <el-dialog
    title="添加权限"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="选择权限" prop="permission_ids">
        <el-select 
          multiple
          size="small"
          filterable
          v-model="form.permission_ids">
          <el-option
            v-for="item in permissionList"
            :key="item.id"
            :label="item.permission"
            :value="item.id">
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
  import { createRolePermission, getPermissionList } from '@/api/systemManage/system.js'
  import { Message } from 'element-ui'

  const formData = {
    'permission_ids': []
  }
  export default {
    props: ['id'],
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        permissionList: [],
        rules: {
          permission_ids: [
            { required: true, message: '权限不能为空', trigger: 'blur' }
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
        this.getSelectList()
      },
      getSelectList() {
        var params = {
          'role_id': this.$props.id
        }
        getPermissionList(params).then(res => {
          this.permissionList = res
        }).catch(error => {
          Message.error(error)
        })
      },
      doSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var successCallBack = () => {
              this.$emit('getList')
              Message.success('添加成功！')
              this.dialogVisible = false
            }
            const params = {
              'permission_ids': this.form.permission_ids
            }
            createRolePermission(this.$props.id, params).then(response => {
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