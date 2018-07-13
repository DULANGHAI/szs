<template>
  <div class="container">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务审批" name="first">
          <div class="tabs-contents">
            <!-- 提交者审批者信息 -->
            <el-form label-width="84px" size="small" label-position="left">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="提交者">
                    <div></div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="提交时间">
                    <div></div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态">
                    <div></div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="审批者">
                    <div></div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="divider"></div>
            <!-- 任务内容展示 -->
            <el-form ref="form" label-width="84px" size="small" label-position="left">
              <el-form-item label="任务名">
                <div>{{form.task_name}}</div>
              </el-form-item>
              <el-form-item label="备注">
                <div>{{form.task_description}}</div>
              </el-form-item>
              <el-form-item label="任务类型">
                <div>{{form.task_type}}</div>
              </el-form-item>

              <el-form-item label="目标系统">
                <div>{{form.task_target_system}}</div>
              </el-form-item>
              <el-form-item label="语言" v-if="form.task_type !== 'file'">
                <div>{{form.task_language}}</div>
              </el-form-item>
              <!-- 命令 -->
              <el-form-item label="命令" v-if="form.task_type === 'commond'">
                <div>{{form.task_command}}</div>
              </el-form-item>
              <!-- 脚本 -->
              <div v-if="form.task_type === 'script'">
                <el-form-item label="脚本">
                  <div>{{form.task_script}}</div>
                </el-form-item>
                <el-form-item label="脚本版本">
                  <div>{{form.task_script_version}}</div>
                  <el-button type="text" size="small">查看脚本</el-button>
                </el-form-item>
                <el-form-item label="脚本变量">
                  <div>{{form.task_script_parameter}}</div>
                  <div>-a 文件名     -o 输出文件名     -p 进程名</div>
                </el-form-item>
              </div>

              <div v-if="form.task_type !== 'file'">
                <el-form-item label="超时时间">
                  <span>{{form.task_time_out}}</span>
                  秒
                </el-form-item>
                <el-form-item label="风险">
                  <risk-level :level.sync="form.task_risk_level" :changeable="true"></risk-level>
                </el-form-item>
                <el-form-item label="风险说明">
                  <el-input v-if="!view" type="textarea" v-model="form.task_risk_statement"></el-input>
                  <div v-if="view">{{form.task_risk_statement}}</div>
                </el-form-item>
              </div>
              
              <el-form-item label="启用">
                <div>{{form.task_is_enable}}</div>
              </el-form-item>

              <!-- 按钮组 -->
              <el-form-item>
                <el-button @click="goBack">返回</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批记录" name="second">
          <div class="tabs-contents">
            <!-- 提交者审批者信息 -->
            <el-form label-width="84px" size="small" label-position="left">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="提交者">
                    <div></div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="提交时间">
                    <div></div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态">
                    <div></div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="审批者">
                    <div></div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="风险">
                    <risk-level :level="origin.task_risk_level"></risk-level>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="divider"></div>
            <el-table
              :data="recordData"
              style="width: 100%">
              <el-table-column prop="date" label="姓名"></el-table-column>
              <el-table-column prop="date" label="审批时间"></el-table-column>
              <el-table-column prop="date" label="审批意见"></el-table-column>
              <el-table-column label="风险等级">
                <template slot-scope="scope">
                  <risk-level :level="scope.row.task_risk_level"></risk-level>
                </template>
              </el-table-column>
              <el-table-column label="审批结果">
                <template slot-scope="scope">
                  <div v-if="scope.row.task_status === 'no-pass'" style="color: #F5222D;">拒绝</div>
                  <div v-else-if="scope.row.task_status === 'pass'" style="color: #52C41A;">通过</div>
                  <div v-else>审核中</div>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import ScriptOption from '@/components/ScriptOption'

import { getLanguageApi, getAllScriptApi, getTaskRiskApi, getTaskApi } from '@/api/taskList'

export default {
  props: ['id', 'view'],
  components: {
    Breadcrumb,
    RiskLevel,
    ScriptOption
  },
  data() {
    return {
      activeName: 'first',
      form: {
        task_creator: '',
        task_update_time: '',
        task_status: 'pending',
        approve_record: [],

        task_name: '',
        task_description: '',
        task_type: 'script',
        task_target_system: '',
        task_language: '',
        task_command: '',

        task_script: '',
        task_script_parameter: '',
        task_script_version: '',

        task_time_out: 1,
        task_risk_level: 0,
        task_risk_statement: '风险说明自动填写评估详情，用户不能修改',
        task_is_enable: false
      },
      systemAndLang: {
        windows: ['windows1', 'windows2', 'windows3'],
        linux: ['linux1', 'linux2', 'linux3']
      },
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
      scriptVersionOptions: [],
      origin: {
        task_risk_level: 1
      },
      recordData: []
    }
  },
  created() {
    if (this.id) {
      Promise.all([getTaskApi(this.id), getAllScriptApi(), getLanguageApi()])
        .then(res => {
          debugger
          this.form = res[0]
          this.scriptOptions = res[1].items
          this.systemAndLang = res[2]
        }).catch(err => {
          console.log(err)
        })
    } else {
      getAllScriptApi().then(res => {
        this.scriptOptions = res.items
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
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  & /deep/ .container-body .el-tabs__nav-scroll {
    padding: 0px 24px;
    background: #fff;
  }
  & /deep/ .container-body .el-tabs__content {
    margin: 0px 24px;
    background: #fff;
    min-height: 100%;
  }
  & /deep/ .tabs-contents {
    padding: 29px 32px;
  }
}
.divider {
  border-bottom: 1px solid #E8E8E8;
  margin: 10px 0;
}
</style>
