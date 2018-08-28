<template>
  <div class="container">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body" v-loading="loading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务审批" name="first">
          <div class="tabs-contents">
            <!-- 提交者审批者信息 -->
            <el-form label-width="84px" size="small" label-position="left">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="提交者">
                    <div>{{form.creator}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="提交时间">
                    <div>{{$dayjs(form.created_at).format('YYYY-MM-DD HH:mm:ss')}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态">
                    <div>{{form.status}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="审批者">
                    <div>
                      <span v-for="(item, index) in form.approve_record" :key="index">
                        <span :class="item.status === 'pass' ? 'green-circle' : (item.status === 'no-pass' ? 'red-circle' : 'dark-circle')"></span>
                        {{item.approver}}
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="divider"></div>
            <!-- 任务内容展示 -->
            <el-form :model="form" ref="form" label-width="84px" size="small" label-position="left">
              <el-form-item label="任务名">
                <div>{{form.name}}</div>
              </el-form-item>
              <el-form-item label="备注">
                <div>{{form.description}}</div>
              </el-form-item>
              <el-form-item label="任务类型">
                <div>{{form.type}}</div>
              </el-form-item>

              <el-form-item label="目标系统">
                <div>{{form.target_system}}</div>
              </el-form-item>
              <el-form-item label="语言" v-if="form.type !== 'file'">
                <div>{{form.language}}</div>
              </el-form-item>
              <!-- 命令 -->
              <el-form-item label="命令" v-if="form.type === 'command'">
                <div>{{form.command}}</div>
              </el-form-item>
              <!-- 脚本 -->
              <div v-if="form.type === 'script'">
                <el-form-item label="脚本">
                  <div>{{form.script}}</div>
                </el-form-item>
                <el-form-item label="脚本版本">
                  <div>{{form.script_version}}</div>
                  <el-button type="text" size="small">查看脚本</el-button>
                </el-form-item>
                <el-form-item label="脚本变量">
                  <div v-if="form.language !== 'playbook'">{{form.script_parameter}}</div>
                </el-form-item>
                <script-parame v-if="form.language === 'playbook'" ref="scriptParame" view="1"></script-parame>
              </div>

              <div v-if="form.type !== 'file'">
                <el-form-item label="超时时间">
                  <span>{{form.time_out}}</span>
                  秒
                </el-form-item>
                <el-form-item label="风险">
                  <risk-level :level.sync="form.risk_level" :changeable="!view"></risk-level>
                </el-form-item>
                <el-form-item label="风险说明" prop="risk_statement"
                  :rules="[
                    { required: true, message: '请输入风险说明', trigger: ['blur'] }
                  ]">
                  <el-input v-if="!view" type="textarea" v-model="form.risk_statement"></el-input>
                  <div v-if="view">{{form.risk_statement}}</div>
                </el-form-item>
              </div>
              
              <el-form-item label="启用">
                <el-switch v-model="form.is_enable" disabled></el-switch>
              </el-form-item>

              <el-form-item label="审批说明" prop="approval_comments"
                :rules="[
                  { required: true, message: '请输入审批说明', trigger: ['blur'] }
                ]">
                <el-input v-if="!view" type="textarea" v-model="form.approval_comments"></el-input>
                <div v-if="view">{{form.approval_comments}}</div>
              </el-form-item>

              <!-- 按钮组 -->
              <el-form-item>
                <el-button v-if="!view" type="primary" @click="resolve">通过</el-button>
                <el-button v-if="!view" type="danger" plain @click="reject">拒绝</el-button>
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
                    <div>{{form.creator}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="提交时间">
                    <div>{{$dayjs(form.created_at).format('YYYY-MM-DD HH:mm:ss')}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态">
                    <div>{{form.status}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="审批者">
                    <div>
                      <span v-for="(item, index) in form.approve_record" :key="index">
                        <span :class="item.status === 'pass' ? 'green-circle' : (item.status === 'no-pass' ? 'red-circle' : 'dark-circle')"></span>
                        {{item.approver}}
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="风险">
                    <risk-level :level="origin.risk_level"></risk-level>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="divider"></div>
            <el-table
              :data="form.approve_record"
              style="width: 100%">
              <el-table-column prop="approver" label="姓名"></el-table-column>
              <el-table-column prop="update_at" label="审批时间"></el-table-column>
              <el-table-column prop="approval_comments" label="审批意见"></el-table-column>
              <el-table-column label="风险等级">
                <template slot-scope="scope">
                  <risk-level :level="scope.row.risk_level"></risk-level>
                </template>
              </el-table-column>
              <el-table-column label="审批结果">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 'no-pass'" style="color: #F5222D;">拒绝</div>
                  <div v-else-if="scope.row.status === 'pass'" style="color: #52C41A;">通过</div>
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
import ScriptParame from '@/views/pe/task/taskList/components/ScriptParame'

import { getScriptVersionApi } from '@/api/pe/taskManage/taskList'
import { getLanguageApi, getAllScriptApi, getTaskDataApi, submitApproveApi } from '@/api/pe/taskManage/taskApprove'

export default {
  props: ['id', 'view'],
  components: {
    Breadcrumb,
    RiskLevel,
    ScriptOption,
    ScriptParame
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      form: {
        creator: '',
        created_at: '',
        status: '',
        approve_record: [],

        name: '',
        description: '',
        type: '',
        target_system: '',
        language: '',
        command: '',

        script: '',
        script_parameter: '',
        script_version: '',

        time_out: 1,
        risk_level: 0,
        risk_statement: '风险说明自动填写评估详情，用户不能修改',
        is_enable: false,

        approval_comments: ''
      },
      systemAndLang: {},
      scriptOptions: [],
      scriptVersionOptions: [],
      origin: {
        risk_level: ''
      }
    }
  },
  created() {
    this.loading = true
    if (this.id) {
      Promise.all([getTaskDataApi(this.id), getAllScriptApi(), getLanguageApi()])
        .then(res => {
          this.form = res[0]
          this.origin.risk_level = res[0].risk_level
          this.scriptOptions = res[1].items
          this.systemAndLang = res[2]
          this.$nextTick(() => {
            // 如果是脚本任务还需再请求一些接口
            if (res[0].type === 'script') {
              this.doWhenScript()
            }
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    } else {
      getAllScriptApi().then(res => {
        this.scriptOptions = res.items
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted() {

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
      // 如果选择的是playbook
      if (this.form.language === 'playbook') {
        const data = JSON.parse(this.form.script_parameter)
        const temp = []
        Object.keys(data).forEach(keyName => {
          temp.push({
            key: keyName,
            value: data[keyName]
          })
        })
        this.$refs.scriptParame.setData(temp)
      }
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
    systemChange() {
      this.form.language = ''
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    goBack() {
      this.$router.back()
    },
    resolve() {
      this.submit('pass')
    },
    reject() {
      this.submit('no-pass')
    },
    submit(status) {
      this.$refs.form.validate((valide) => {
        if (valide) {
          const data = {
            status: status,
            approval_comments: this.form.approval_comments,
            risk_level: this.form.risk_level,
            risk_statement: this.form.risk_statement
          }
          submitApproveApi(this.id, data).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.push({
              path: `/pe/taskManage/taskApprove`
            })
          })
        }
      })
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
