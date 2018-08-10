<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      添加应用实例
    </div>
    <div class="container-body-wrap add-app-body">
      <template>
        <!-- 筛选 -->
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="实例名称" prop="instance_name">
                <el-input v-model="form.instance_name" auto-complete="off" placeholder="请输入实例名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实例介绍" prop="instance_description">
                <el-input v-model="form.instance_description" auto-complete="off" placeholder="请输入实例介绍"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用" prop="name">
                <el-select v-model="appName"  style="width:100%" placeholder="请选择应用" @change="appChange">
                  <el-option v-for="item in appList" :key="item.key" :label="item.value" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="版本" prop="version">
                <el-select v-model="form.version"  style="width:100%" placeholder="请选择版本">
                  <el-option v-for="item in branchOptions" :key="item.key" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用类型" prop="type">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择应用类型">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开发语言" prop="language">
                <el-select v-model="form.language"  style="width:100%" placeholder="请选择开发语言">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="软件包库" prop="sw_package_repository">
                <el-input v-model="form.sw_package_repository" @focus="$refs.rjb_file.showMoel()" readonly placeholder="请选择软件包库"></el-input>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="配置文件库" prop="cfg_file_repository">
                <el-input v-model="form.cfg_file_repository" @focus="$refs.pzwj_file.showMoel()" readonly placeholder="请选择配置文件库"></el-input>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="变量">
                <el-button size="small" @click="addParameters"><i class="el-icon-plus" />添加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in form.parametersArray">
            <el-col :span="6">
              <el-form-item label="字段">
                <el-input v-model="item.name" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="值">
                <el-input v-model="item.value" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeParameters(item)" style="margin-left:20px">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="10">
              <el-button type="primary" @click="doSubmit">确定</el-button>
              <el-button @click.prevent="cancelGoList">取消</el-button>
              <el-button @click.prevent="formReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </div>
    <!-- 文件选择model -->
    <file-model ref="rjb_file" :fileOk="rjb_fileOk"></file-model>
    <file-model ref="pzwj_file" :fileOk="pzwj_fileOk"></file-model>
  </div>
</template>

<script>
import { getRepositoryYuyan, getBranchList } from '@/api/script'
import { addApplication, getApplicationDetail, putApplication } from '@/api/resouce/applications/application'
import Breadcrumb from '@/components/Breadcrumb'
import FileModel from './fileModel'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'

const formData = {
  'instance_name': '',
  'instance_description': '',
  'name': '',
  'type': '',
  'language': '',
  'version': '',
  'parametersArray': [],
  'sw_package_repository': '',
  'cfg_file_repository': ''
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    FileModel
  },
  data() {
    return {
      appList: [], // 应用
      branchOptions: [], // 版本
      fileTypeList: [{
        label: '脚本',
        value: 'scripts'
      }, {
        label: '软件包',
        value: 'applications'
      }, {
        label: '配置文件',
        value: 'configurations'
      }],
      rjb_file: {
        name: '',
        target_path: ''
      },
      pzwj_file: {
        name: '',
        target_path: ''
      },
      isEdit: false,
      current: null,
      listLoading: false,
      appName: '',
      form: JSON.parse(JSON.stringify(formData)),
      rules: {
        instance_name: [
          { required: true, message: '实例名不能为空', trigger: 'blur' }
        ],
        instance_description: [
          { required: true, message: '实例介绍不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '应用名不能为空', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '版本不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '应用类型不能为空', trigger: 'blur' }
        ],
        language: [
          { required: true, message: '开发语言不能为空', trigger: 'blur' }
        ],
        sw_package_repository: [
          { required: true, message: '软件包库不能为空', trigger: 'blur' }
        ],
        cfg_file_repository: [
          { required: true, message: '配置文件不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAppList()
    if (this.$route.params.id && this.$route.params.id !== undefined) {
      this.getAppDetail()
    }
  },
  watch: {
    'appName'(val, oldVal) {
      this.form.name = val.value
    }
  },
  methods: {
    // 取消回到列表页
    cancelGoList() {
      this.$router.push({
        name: 'applist'
      })
    },
    // 应用名称
    getAppList() {
      var params = {
        group_id: 7
      }
      getRepositoryYuyan(params).then(response => {
        this.appList = response.map((item, index) => {
          const ali = {
            key: item.id,
            value: item.name
          }
          return ali
        })
      }).catch(error => {
        Message.error(error)
      })
    },
    // 应用详情
    getAppDetail() {
      this.isEdit = true
      getApplicationDetail(this.$route.params.id).then(response => {
        this.form = response
        this.appName = {
          value: response.name
        }
        this.form = {
          ...this.form,
          name: response.name
        }
        this.form.parametersArray = response.parameters
      }).catch(error => {
        Message.error(error)
      })
    },
    // 选择应用，关联出版本
    appChange(app) {
      this.form.version = ''
      getBranchList(app.key).then(response => {
        this.branchOptions = response.map((item, index) => {
          const ali = {
            key: item.project_id,
            value: item.name
          }
          return ali
        })
      }).catch(error => {
        Message.error(error)
      })
    },
    // 提交应用表单
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var successCallBack = () => {
            Message.success(!this.isEdit ? '添加成功！' : '更新成功！')
            this.cancelGoList()
          }

          if (!this.isEdit) {
            const formParms = {
              'instance_name': this.form.instance_name,
              'instance_description': this.form.instance_description,
              'name': this.appName.value,
              'version': this.form.version,
              'language': this.form.language,
              'type': this.form.type,
              'sw_package_repository': this.form.sw_package_repository,
              'cfg_file_repository': this.form.cfg_file_repository,
              'parameters': this.form.parametersArray
            }
            addApplication(formParms).then(response => {
              successCallBack()
            }).catch(error => {
              Message.error(error)
            })
          } else {
            const formParms = {
              'instance_name': this.form.instance_name,
              'instance_description': this.form.instance_description,
              'name': this.appName.value,
              'version': this.form.version,
              'language': this.form.language,
              'type': this.form.type,
              'sw_package_repository': this.form.sw_package_repository,
              'cfg_file_repository': this.form.cfg_file_repository,
              'parameters': this.form.parametersArray
            }
            putApplication(this.$route.params.id, formParms).then(response => {
              successCallBack()
            }).catch(error => {
              Message.error(error)
            })
          }
        }
      })
    },
    // 添加变量
    addParameters() {
      this.form.parametersArray.push({
        'name': '',
        'value': ''
      })
    },
    // 删除变量
    removeParameters(item) {
      var index = this.form.parametersArray.indexOf(item)
      if (index !== -1) {
        this.form.parametersArray.splice(index, 1)
      }
    },
    // 重置表单
    formReset() {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      this.appName = ''
      this.form = JSON.parse(JSON.stringify(formData))
    },
    rjb_fileOk(data) {
      this.form.sw_package_repository = data.path
      console.log(data.path)
    },
    pzwj_fileOk(data) {
      this.form.cfg_file_repository = data.path
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    // 重置
    searchReset() {
      this.form = JSON.parse(JSON.stringify(formData))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
