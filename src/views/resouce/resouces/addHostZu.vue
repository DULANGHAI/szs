<template>
  <el-dialog
    :title="!isEdit ? '新建主机组' : '编辑主机组' "
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog add-host-dig">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="组名" prop="name">
            <el-input v-model="form.name" size="small" auto-complete="off" placeholder="请输入组名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="comment">
            <el-input type="textarea" size="small" v-model="form.comment" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="主机" prop="risk_level">
            <el-select size="small" multiple v-model="form.risk_level" placeholder="请选择版本">
              <el-option
                v-for="item in hostList"
                :key="item.id"
                :label="item.identity_ip"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号" class="label-border">
            <el-button size="small"><i class="el-icon-plus" />添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户名">
            <el-input v-model="form.name" size="small" auto-complete="off" placeholder="请输入组名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="密码">
            <el-input v-model="form.name" size="small" auto-complete="off" placeholder="请输入组名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="text" @click.prevent="removeParameters(item)" style="margin-left:20px">删除</el-button>
        </el-col>
      </el-row> 
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号" class="label-border">
            <el-button size="small"><i class="el-icon-plus" />添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户名">
            <el-input v-model="form.name" size="small" auto-complete="off" placeholder="请输入组名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="密码">
            <el-input v-model="form.name" size="small" auto-complete="off" placeholder="请输入组名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="text" @click.prevent="removeParameters(item)" style="margin-left:20px">删除</el-button>
        </el-col>
      </el-row> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addRisk, putRisk } from '@/api/resouce/versionLibrary/risk'
  import { getAppHostList } from '@/api/resouce/resouces/host'
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
        hostList: [],
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
    created() {
      this.getHostArray()
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
      getHostArray() {
        getAppHostList('LDDS').then(response => {
          this.hostList = response
        }).catch(error => {
          Message.error(error)
        })
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