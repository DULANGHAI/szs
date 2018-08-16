<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="94px" size="small" label-position="left">
        <el-form-item label="任务名" prop="name">
          <el-input v-if="!view" v-model="form.name" placeholder="请输入任务名"></el-input>
          <div v-if="view">{{form.name}}</div>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-if="!view" type="textarea" v-model="form.description" :autosize="{ minRows: 4 }" placeholder="请输入备注"></el-input>
          <div v-if="view">{{form.description}}</div>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-radio-group v-if="!view" v-model="form.type" @change="systemChange">
            <el-radio label="command">命令</el-radio>
            <el-radio label="script">脚本</el-radio>
            <el-radio label="file">文件分发</el-radio>
          </el-radio-group>
          <div v-if="view">{{form.type}}</div>
        </el-form-item>

        <div style="display: flex;">
          <el-form-item label="目标系统" prop="target_system">
            <el-select v-if="!view" v-model="form.target_system" @change="systemChange" placeholder="请选择" :disabled="!Object.keys(systemAndLang).length">
              <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <div v-if="view">{{form.target_system}}</div>
          </el-form-item>
          <el-form-item label="语言" prop="language" label-width="50px" style="margin-left: 40px;" v-if="form.type !== 'file'">
            <el-select v-if="!view" v-model="form.language" placeholder="请选择" :disabled="!form.target_system" @change="languageChange">
              <el-option v-for="(item, index) in systemAndLang[form.target_system]" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <div v-if="view">{{form.language}}</div>
          </el-form-item>
        </div>
        
        <!-- 命令 -->
        <el-form-item label="命令" v-if="form.type === 'command'" prop="command">
          <el-input v-if="!view" type="textarea" v-model="form.command" @blur="getRiskAndState" :autosize="{ minRows: 4 }" placeholder="请输入命令"></el-input>
          <!-- <div v-if="view">{{form.command}}</div> -->
          <pre v-if="view" class="pre">{{form.command}}</pre>
        </el-form-item>
        <!-- 脚本 -->
        <div v-if="form.type === 'script'">
          <el-form-item label="脚本" prop="script" key="script">
            <el-select v-if="!view" value-key="full_path" v-model="selectedScript"
              :disabled="!form.language"
              filterable
              placeholder="请选择脚本"
              popper-class="script-select"
              @change="scriptChange">
              <el-option v-for="item in scriptOptions" :key="item.full_path" :label="item.name" :value="item">
                <script-option :data="item"></script-option>
              </el-option>
            </el-select>
            <div v-if="view">{{selectedScript.name}}</div>
          </el-form-item>
          <el-form-item label="脚本版本" prop="script_version" key="script_version">
            <el-select v-if="!view" value-key="version" v-model="selectedVersion"
              :disabled="!form.script"
              filterable
              placeholder="请选择脚本">
              <el-option v-for="item in scriptVersionOptions" :key="item.id" :label="item.version" :value="item"></el-option>
            </el-select>
            <div v-if="view">{{selectedVersion.version}}</div>
            <el-button type="text" size="small">查看脚本</el-button>
          </el-form-item>
          <el-form-item label="脚本变量" prop="script_parameter" key="script_parameter">
            <el-input v-if="!view" v-model="form.script_parameter"></el-input>
            <div v-if="view">{{form.script_parameter}}</div>
          </el-form-item>
        </div>
        <!-- 文件分发 -->
        <div v-if="form.type === 'file'">
          <el-form-item label="文件分发"></el-form-item>
          <file-select ref="fileSelect" :view="view"></file-select>
          <div style="display: flex;">
            <el-form-item label="文件所有者" prop="file_owner" key="file_owner">
              <el-input v-if="!view" v-model="form.file_owner" placeholder="请输入"></el-input>
              <div v-if="view">{{form.file_owner}}</div>
            </el-form-item>
            <el-form-item label="文件权限" prop="file_permission" key="file_permission" style="margin-left: 40px;">
              <el-input v-if="!view" v-model="form.file_permission" placeholder="请输入"></el-input>
              <div v-if="view">{{form.file_permission}}</div>
            </el-form-item>
          </div>
          <el-form-item label="文件替换" prop="is_replace" key="is_replace">
            <el-switch v-model="form.is_replace" :disabled="view === '1'"></el-switch>
          </el-form-item>
        </div>

        <div v-if="form.type !== 'file'">
          <el-form-item label="超时时间" prop="time_out">
            <el-input-number v-if="!view" v-model="form.time_out" controls-position="right" :min="1" :precision="0"></el-input-number>
            <span v-if="view">{{form.time_out}}</span>
            秒
          </el-form-item>
          <el-form-item label="风险" prop="risk_level">
            <risk-level :level="form.risk_level"></risk-level>
          </el-form-item>
          <el-form-item label="风险说明" prop="risk_statement">
            <el-input v-if="!view" type="textarea" v-model="form.risk_statement" disabled></el-input>
            <div v-if="view">{{form.risk_statement}}</div>
          </el-form-item>
        </div>
        
        <el-form-item label="启用" prop="is_enable">
          <el-switch v-model="form.is_enable" :disabled="view === '1'"></el-switch>
        </el-form-item>

        <!-- 添加的按钮组 -->
        <el-form-item v-if="!view && !id">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
        <!-- 编辑的按钮组 -->
        <el-form-item v-if="!view && id">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
        <!-- 查看的按钮组 -->
        <el-form-item v-if="view">
          <el-button @click="goEdit" :disabled="form.status === '审批中'">编辑</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import ScriptOption from '@/components/ScriptOption'
import FileSelect from './components/FileSelect'

import { getLanguageApi, getTaskRiskApi, createTaskApi, getTaskApi, upadateTaskApi, getAllScriptApi, getScriptVersionApi } from '@/api/pe/taskManage/taskList'

export default {
  props: ['id', 'view'],
  components: {
    Breadcrumb,
    RiskLevel,
    ScriptOption,
    FileSelect
  },
  data() {
    return {
      loading: false,
      form: {
        project_id: '',
        name: '',
        description: '',
        type: 'command',
        target_system: '',
        language: '',
        command: '',

        script: '',
        script_parameter: '',
        script_version: '',

        file_selection: '',
        file_owner: '',
        file_permission: '',
        is_replace: false,

        time_out: 1,
        risk_level: 0,
        risk_statement: '风险说明自动填写评估详情，用户不能修改',
        is_enable: false
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: '请输入备注', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        target_system: [
          { required: true, message: '请选择目标系统', trigger: 'change' }
        ],
        language: [
          { required: true, message: '请选择语言', trigger: 'change' }
        ],
        command: [
          { required: true, message: '请输入命令', trigger: ['blur', 'change'] }
        ],
        script: [
          { required: true, message: '请选择脚本', trigger: 'change' }
        ],
        script_parameter: [
          { required: true, message: '请输入脚本参数', trigger: ['blur', 'change'] }
        ],
        script_version: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        file_owner: [
          { required: true, message: '请输入文件所有者', trigger: ['blur', 'change'] }
        ],
        file_permission: [
          { required: true, message: '请输入文件权限', trigger: ['blur', 'change'] }
        ]
      },
      systemAndLang: {},
      scriptOptions: [],
      scriptVersionOptions: [],
      selectedScript: {}, // 选中的脚本
      selectedVersion: {}
    }
  },
  watch: {
    selectedScript(val) {
      if (val.full_path) {
        this.form.script = val.full_path
        this.form.risk_level = val.risk_level
        this.form.risk_statement = val.comment
      } else {
        this.form.script = ''
        this.form.risk_level = ''
        this.form.risk_statement = ''
      }
    },
    selectedVersion(val) {
      this.form.script_version = val.commit_sha
    },
    'form.language'(val) {
      this.form.project_id = this.getLanguageId(val)
    }
  },
  created() {
    this.loading = true
    if (this.id) {
      Promise.all([getTaskApi(this.id), getLanguageApi()])
        .then(res => {
          this.form = res[0]
          this.systemAndLang = res[1]
          this.$nextTick(() => {
            // 如果是脚本任务还需再请求一些接口
            if (res[0].type === 'script') {
              this.doWhenScript()
            } else if (res[0].type === 'file') { // 处理文件分发任务
              this.doWhenFile()
            }
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    } else {
      // todo
      Promise.all([getLanguageApi()])
        .then(res => {
          this.systemAndLang = res[0]
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    }
  },
  methods: {
    /**
     * 当查看、编辑遇到脚本任务时还需处理
     */
    doWhenScript() {
      // 1.先获取脚本选项
      const id = this.getLanguageId(this.form.language)
      getAllScriptApi({ id: id }).then(res => {
        this.scriptOptions = res
        // 2.确定选中的脚本是哪个
        this.selectedScript = this.computeSelectedScript(res)
        // 3.获取脚本版本选项
        getScriptVersionApi(this.selectedScript.file_id).then(res1 => {
          this.scriptVersionOptions = res1
          // 4.确定选中的版本是哪个
          this.selectedVersion = this.computeSelectedVersion(res1)
        })
      })
    },
    /**
     * 当查看、编辑遇到文件分发任务时还需处理
     */
    doWhenFile() {
      const data = JSON.parse(this.form.file_selection)
      this.$refs.fileSelect.setData(data)
    },
    computeSelectedScript(res) {
      let result = {}
      for (let i = 0; i < res.length; i++) {
        if (res[i].full_path === this.form.script) {
          result = res[i]
          break
        }
      }
      return result
    },
    computeSelectedVersion(res) {
      let result = {}
      for (let i = 0; i < res.length; i++) {
        if (res[i].commit_sha === this.form.script_version) {
          result = res[i]
          break
        }
      }
      return result
    },
    getRiskAndState() {
      if (!this.form.command) {
        return
      }
      getTaskRiskApi({
        command: this.form.command
      }).then(res => {
        this.form.risk_level = res.risk_level
        this.form.risk_statement = res.risk_statement
      })
    },
    systemChange() {
      this.form.language = ''
      this.form.script = ''
      this.form.script_version = ''
    },
    languageChange(val) {
      this.selectedScript = {}
      const id = this.getLanguageId(val)
      getAllScriptApi({ id: id }).then(res => {
        this.scriptOptions = res
      })
    },
    getLanguageId(val) {
      let result = ''
      const data = this.systemAndLang[this.form.target_system]
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === val) {
          result = data[i].id
          break
        }
      }
      return result
    },
    scriptChange(val) {
      this.selectedVersion = {}
      getScriptVersionApi(val.file_id).then(res => {
        this.scriptVersionOptions = res
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        description: '',
        type: 'command',
        target_system: '',
        language: '',
        command: '',

        script: '',
        script_parameter: '',
        script_version: '',

        file_selection: '',
        file_owner: '',
        file_permission: '',
        is_replace: false,

        time_out: 1,
        risk_level: 0,
        risk_statement: '风险说明自动填写评估详情，用户不能修改',
        is_enable: false
      }
      this.$refs.fileSelect && this.$refs.fileSelect.reset()
    },
    submit() {
      if (this.form.type === 'file') {
        this.$refs.fileSelect.$refs.selectForm.validate((valid) => {
          if (valid) {
            this.form.file_selection = JSON.stringify(this.$refs.fileSelect.getData())
            this.mainValide()
          } else {
            return
          }
        })
      } else {
        this.mainValide()
      }
    },
    mainValide() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.type === 'file' ||
              this.form.type !== 'file' && this.form.risk_level === 0) {
            this.$message.info('等待风险等级返回，稍后提交')
            return
          }
          if (this.form.id) { // update
            upadateTaskApi(this.form.id, this.form).then(res => {
              if (res.id) {
                this.$router.push({
                  path: `/pe/taskManage/taskList`
                })
              }
            })
          } else {
            createTaskApi(this.form).then(res => {
              if (res.id) {
                this.$router.push({
                  path: `/pe/taskManage/taskList`
                })
              }
            })
          }
        }
      })
    },
    goEdit() {
      this.$router.push({
        path: `/pe/taskManage/taskEdit/${this.id}`
      })
    },
    goBack() {
      this.$router.back()
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
.pre {
  margin: 0;
  // white-space: pre-line;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
</style>
