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
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" size="small" v-model="form.description" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="主机" prop="hosts">
            <el-select size="small" multiple v-model="form.hosts" placeholder="请选择主机">
              <el-option
                v-for="(item, index) in hostList"
                :key="index"
                :label="item.identity_ip"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="变量" class="label-border">
            <el-button size="small" @click="addParameters"><i class="el-icon-plus" />添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in form.params">
        <el-col :span="10">
          <el-form-item label="字段">
            <el-input v-model="item.name" size="small" auto-complete="off" placeholder="请输入字段"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="变量">
            <el-input v-model="item.value" size="small" auto-complete="off" placeholder="请输入变量"></el-input>
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
  import { mapGetters } from 'vuex'
  import { getAppHostList, getAddGroups, getEditGroups, putGroups } from '@/api/resouce/resouces/host'
  import { Message } from 'element-ui'

  const formData = {
    'name': '',
    'description': '',
    'hosts': [],
    'comment': '',
    'params': [],
    'pid': '',
    'business': ''
  }
  export default {
    props: ['pid'],
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isEdit: false,
        hostList: [],
        userarry: [],
        isEditId: '',
        marry: [],
        rules: {
          name: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'repository'
      ])
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
          // this.form = item[0]
          this.getEditGroup(item[0].id)
          this.isEditId = item[0].id
          this.marry = item[0]
        } else {
          this.marry = item[0]
        }
      },
      // 编辑获取data
      getEditGroup(id) {
        getEditGroups(id).then(response => {
          const host_id = []
          response.hosts.map((item) => {
            host_id.push(item.id)
          })
          this.form = response
          this.form.hosts = host_id
        }).catch(error => {
          Message.error(error)
        })
      },
      // 添加变量
      addParameters() {
        this.form.params.push({
          'name': '',
          'value': ''
        })
      },
      // 删除变量
      removeParameters(item) {
        var index = this.form.params.indexOf(item)
        if (index !== -1) {
          this.form.params.splice(index, 1)
        }
      },
      // 获取主机列表
      getHostArray() {
        getAppHostList(this.repository).then(response => {
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
              const paramsArr = {
                'name': this.form.name,
                'description': this.form.description,
                'host_ids': this.form.hosts,
                'params': this.form.params,
                'pid': this.marry.id,
                'business': this.marry.business
              }
              getAddGroups(paramsArr).then(response => {
                successCallBack()
              }).catch(error => {
                Message.error(error)
              })
            } else {
              const paramsArr = {
                'name': this.form.name,
                'description': this.form.description,
                'host_ids': this.form.hosts,
                'params': this.form.params,
                'business': this.marry.business
              }
              putGroups(this.form.id, paramsArr).then(response => {
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