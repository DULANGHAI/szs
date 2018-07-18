<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <el-form ref="form" label-width="84px" size="small" label-position="left">
        <el-form-item label="任务名">
          <el-input v-if="!view" v-model="form.task_name" placeholder="请输入任务名"></el-input>
          <div v-if="view">{{form.task_name}}</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-if="!view" type="textarea" v-model="form.task_description" :autosize="{ minRows: 4 }" placeholder="请输入备注"></el-input>
          <div v-if="view">{{form.task_description}}</div>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-radio-group v-if="!view" v-model="form.task_type">
            <el-radio label="command">命令</el-radio>
            <el-radio label="script">脚本</el-radio>
            <el-radio label="file">文件分发</el-radio>
          </el-radio-group>
          <div v-if="view">{{form.task_type}}</div>
        </el-form-item>

        <div style="display: flex;">
          <el-form-item label="目标系统">
            <el-select v-if="!view" v-model="form.task_target_system" @change="systemChange" placeholder="请选择" :disabled="!Object.keys(systemAndLang).length">
              <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <div v-if="view">{{form.task_target_system}}</div>
          </el-form-item>
          <el-form-item label="语言" label-width="50px" style="margin-left: 40px;" v-if="form.task_type !== 'file'">
            <el-select v-if="!view" v-model="form.task_language" placeholder="请选择" :disabled="!form.task_target_system">
              <el-option v-for="(item, index) in systemAndLang[form.task_target_system]" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <div v-if="view">{{form.task_language}}</div>
          </el-form-item>
        </div>
        
        <!-- 命令 -->
        <el-form-item label="命令" v-if="form.task_type === 'command'">
          <el-input v-if="!view" type="textarea" v-model="form.task_command" @blur="getRiskAndState" :autosize="{ minRows: 4 }" placeholder="请输入命令"></el-input>
          <div v-if="view">{{form.task_command}}</div>
        </el-form-item>
        <!-- 脚本 -->
        <div v-if="form.task_type === 'script'">
          <el-form-item label="脚本">
            <el-select v-if="!view" v-model="form.task_script"
              :disabled="!form.task_language"
              filterable
              placeholder="请选择脚本"
              popper-class="script-select">
              <el-option v-for="(item, index) in scriptOptions" :key="index" :label="item.name" :value="item.name">
                <script-option :data="item"></script-option>
              </el-option>
            </el-select>
            <div v-if="view">{{form.task_script}}</div>
          </el-form-item>
          <el-form-item label="脚本版本">
            <el-select v-if="!view" v-model="form.task_script_version"
              :disabled="!form.task_script"
              filterable
              placeholder="请选择脚本">
              <el-option v-for="item in scriptVersionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-if="view">{{form.task_script_version}}</div>
            <el-button type="text" size="small">查看脚本</el-button>
          </el-form-item>
          <el-form-item label="脚本变量">
            <el-input v-if="!view" v-model="form.task_script_parameter" disabled></el-input>
            <div v-if="view">{{form.task_script_parameter}}</div>
            <div>-a 文件名     -o 输出文件名     -p 进程名</div>
          </el-form-item>
        </div>
        <!-- 文件分发 -->
        <div v-if="form.task_type === 'file'">
          <el-form-item label="文件分发">
            <div>接口没有，暂时放下</div>
          </el-form-item>
          <div style="display: flex;">
            <el-form-item label="文件所有者">
              <el-input v-if="!view" v-model="form.task_file_owner" placeholder="请输入"></el-input>
              <div v-if="view">{{form.task_file_owner}}</div>
            </el-form-item>
            <el-form-item label="文件权限" style="margin-left: 40px;">
              <el-input v-if="!view" v-model="form.task_file_permission" placeholder="请输入"></el-input>
              <div v-if="view">{{form.task_file_permission}}</div>
            </el-form-item>
          </div>
          <el-form-item label="文件替换">
            <el-switch v-if="!view" v-model="form.task_is_replace"></el-switch>
            <div v-if="view">{{form.task_is_replace}}</div>
          </el-form-item>
        </div>

        <div v-if="form.task_type !== 'file'">
          <el-form-item label="超时时间">
            <el-input-number v-if="!view" v-model="form.task_time_out" controls-position="right" :min="1" :precision="1"></el-input-number>
            <span v-if="view">{{form.task_time_out}}</span>
            秒
          </el-form-item>
          <el-form-item label="风险">
            <risk-level :level="form.task_risk_level"></risk-level>
          </el-form-item>
          <el-form-item label="风险说明">
            <el-input v-if="!view" type="textarea" v-model="form.task_risk_statement" disabled></el-input>
            <div v-if="view">{{form.task_risk_statement}}</div>
          </el-form-item>
        </div>
        
        <el-form-item label="启用">
          <el-switch v-if="!view" v-model="form.task_is_enable"></el-switch>
          <div v-if="view">{{form.task_is_enable}}</div>
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
          <el-button @click="goEdit">编辑</el-button>
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

import { getLanguageApi, getTaskRiskApi, createTaskApi, getTaskApi, upadateTaskApi } from '@/api/taskList'

export default {
  props: ['id', 'view'],
  components: {
    Breadcrumb,
    RiskLevel,
    ScriptOption
  },
  data() {
    return {
      form: {
        task_name: '',
        task_description: '',
        task_type: 'command',
        task_target_system: '',
        task_language: '',
        task_command: '',

        task_script: '',
        task_script_parameter: '',
        task_script_version: '',

        task_file_owner: '',
        task_file_permission: '',
        task_is_replace: false,

        task_time_out: 1,
        task_risk_level: 0,
        task_risk_statement: '风险说明自动填写评估详情，用户不能修改',
        task_is_enable: false
      },
      systemAndLang: {},
      scriptOptions: [
        {
          name: 'install_tomcat',
          full_path: '/ops/linux/python/install_tomcat.py',
          comment: '执行安装tomcat的运维指令，tomcat版本为6.7.1',
          risk_level: 1
        },
        {
          name: 'install_tomcat',
          full_path: '/ops/linux/python/install_tomcat.py',
          comment: '执行安装tomcat的运维指令，tomcat版本为6.7.1',
          risk_level: 1
        }
      ],
      scriptVersionOptions: []
    }
  },
  created() {
    if (this.id) {
      Promise.all([getTaskApi(this.id), getLanguageApi()])
        .then(res => {
          debugger
          this.form = res[0]
          this.systemAndLang = res[1]
        }).catch(err => {
          console.log(err)
        })
    } else {
      // todo
      Promise.all([getLanguageApi()])
        .then(res => {
          this.systemAndLang = res[0]
        })
    }
  },
  mounted() {

  },
  methods: {
    getRiskAndState() {
      if (!this.form.task_command) {
        return
      }
      getTaskRiskApi({
        task_command: this.form.task_command
      }).then(res => {
        this.form.task_risk_level = res.task_risk_level
        this.form.task_risk_statement = res.task_risk_statement
      })
    },
    systemChange() {
      this.form.task_language = ''
      this.form.task_script = ''
      this.form.task_script_version = ''
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    submit() {
      if (this.form.task_risk_level) {
        if (this.form.id) {
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
</style>
