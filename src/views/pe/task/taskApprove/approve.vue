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
            <el-form ref="form" label-width="84px" size="small" label-position="left">
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
                  <div>{{form.script_parameter}}</div>
                  <div>-a 文件名     -o 输出文件名     -p 进程名</div>
                </el-form-item>
              </div>

              <div v-if="form.type !== 'file'">
                <el-form-item label="超时时间">
                  <span>{{form.time_out}}</span>
                  秒
                </el-form-item>
                <el-form-item label="风险">
                  <risk-level :level.sync="form.risk_level" :changeable="!view"></risk-level>
                </el-form-item>
                <el-form-item label="风险说明">
                  <el-input v-if="!view" type="textarea" v-model="form.risk_statement"></el-input>
                  <div v-if="view">{{form.risk_statement}}</div>
                </el-form-item>
              </div>
              
              <el-form-item label="启用">
                <div>{{form.is_enable}}</div>
              </el-form-item>

              <el-form-item label="审批说明">
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

import { getLanguageApi, getAllScriptApi, getTaskDataApi, submitApproveApi } from '@/api/pe/taskManage/taskApprove'

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
        risk_level: ''
      }
    }
  },
  created() {
    if (this.id) {
      Promise.all([getTaskDataApi(this.id), getAllScriptApi(), getLanguageApi()])
        .then(res => {
          this.form = res[0]
          this.origin.risk_level = res[0].risk_level
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
