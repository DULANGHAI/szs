<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      添加任务
    </div>
    <div class="container-body">
      <el-form ref="form" label-width="80px" size="small" label-position="left">
        <el-form-item label="任务名">
          <el-input v-model="form.task_name" placeholder="请输入任务名"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.task_description" :autosize="{ minRows: 4 }" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-radio-group v-model="form.task_type" @change="changeTaskType">
            <el-radio label="commond">命令</el-radio>
            <el-radio label="script">脚本</el-radio>
            <el-radio label="file">文件分发</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="目标系统" v-if="systemAndLang && Object.keys(systemAndLang).length && (form.task_type !== 'file')">
          <el-select v-model="form.task_target_system" @change="systemChange" placeholder="请选择">
            <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言" v-if="form.task_target_system && (form.task_type !== 'file')">
          <el-select v-model="form.task_language" placeholder="请选择">
            <el-option v-for="(item, index) in systemAndLang[form.task_target_system]" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 命令 -->
        <el-form-item label="命令" v-if="form.task_type === 'commond'">
          <el-input type="textarea" v-model="form.task_command" :autosize="{ minRows: 4 }" placeholder="请输入命令"></el-input>
        </el-form-item>
        <!-- 脚本 -->
        <el-form-item label="脚本">
          <el-select v-model="form.task_script"
            filterable
            placeholder="请选择脚本">
            <el-option v-for="item in scriptOptions" :key="item.value" :label="item.label" :value="item.value">
              <div style="height: 65px">
                123111111111111111111111111111111111111111111<risk-level :level="3"></risk-level>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="超时时间">
          <el-input-number v-model="form.task_time_out" controls-position="right" :min="1" :precision="1"></el-input-number>
          秒
        </el-form-item>
        <el-form-item label="风险">
          <risk-level :level="form.task_risk_level"></risk-level>
        </el-form-item>
        <el-form-item label="风险说明">
          <el-input type="textarea" v-model="form.task_risk_statement" disabled></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.task_is_enable"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'

import { getLanguageApi, getAllScriptApi } from '@/api/taskList'
export default {
  name: 'example1',
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      form: {
        task_name: '',
        task_description: '',
        task_type: 'commond',
        task_target_system: '',
        task_language: '',
        task_command: '',

        task_script: '',

        task_time_out: 1,
        task_risk_level: 1,
        task_risk_statement: '风险说明自动填写评估详情，用户不能修改',
        task_is_enable: false
      },
      systemAndLang: {
        windows: ['windows1', 'windows2', 'windows3'],
        linux: ['linux1', 'linux2', 'linux3']
      },
      scriptOptions: [
        {
          'updated_at': '2018-07-10T07:52:44.199Z',
          'new_version': 'string',
          'task_file_permission': 'string',
          'task_command': 'string',
          'current_version': 'string',
          'deleted_at': '2018-07-10T07:52:44.199Z',
          'id': 0,
          'task_is_enable': true,
          'task_creator': 'string',
          'task_file_owner': 'string',
          'task_script': 'string',
          'task_time_out': 0,
          'task_description': 'string',
          'task_file_selection': 'string',
          'task_script_parameter': 'string',
          'task_is_replace': true,
          'task_type': 'string',
          'task_language': 'string',
          'is_deleted': false,
          'task_target_system': 'string',
          'created_at': '2018-07-10T07:52:44.199Z',
          'task_target_directory': 'string',
          'task_name': 'string'
        }
      ]
    }
  },
  mounted() {
    this.getAllScript()
  },
  methods: {
    getLanguage() {
      getLanguageApi().then(res => {
        if (res.success) {
          this.systemAndLang = res
        }
      })
    },
    getAllScript() {
      getAllScriptApi().then(res => {
        this.scriptOptions = res.items
      })
    },
    systemChange() {
      this.form.task_language = ''
    },
    changeTaskType(value) {
      console.log(value)
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container-body {
  margin: 24px;
  padding: 29px 32px;
  border-radius: 4px;
  background-color: #fff;
}
</style>
