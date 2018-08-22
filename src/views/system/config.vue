<template>
  <div class="page-config">
    <Breadcrumb></Breadcrumb>

    <div class="container-title">
      系统配置
    </div>

    <div class="container-body-wrap">
      <el-form
        ref="form"
        :model="form"
        label-width="140px"
        label-position="right"
      >
        <div class="module">
          <h3>审批配置</h3>
          <el-form-item label="任务审批最低等级">
            <el-select v-model="form.approve_config.level" size="small" placeholder="请选择脚本">
              <el-option label="高" value="high"></el-option>
              <el-option label="中" value="middle"></el-option>
              <el-option label="低" value="low"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="脚本提交审批">
            <el-switch v-model="form.approve_config.script_on"></el-switch>
          </el-form-item>
          <el-form-item label="软件包库提交审批">
            <el-switch v-model="form.approve_config.software_on"></el-switch>
          </el-form-item>
          <el-form-item label="配置库提交审批">
            <el-switch v-model="form.approve_config.config_on"></el-switch>
          </el-form-item>
        </div>

        <div class="module line">
          <el-row>
            <el-col :span="3">
              <h3>业务集群配置</h3>
            </el-col>
            <el-col :span="6" :offset="15">
              <el-button size="small" @click.native="createRole">添加</el-button>              
              <el-button size="small" :disabled="multipleSelection.length >0 ? false : true " @click.native="removeDomain">删除</el-button>
              <el-button size="small" :disabled="multipleSelection.length === 1 ? false : true " @click.native="editRole">编辑</el-button>
            </el-col>
          </el-row>
        
          <el-table
            ref="table"
            :data="form.business_config"
            tooltip-effect="dark"
            style="width: 100%; margin-top: 30px"
            empty-text="暂无数据"
            v-loading.body="tableLoading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column width="180" prop="name" label="集群名称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
          </el-table>
        </div>

        <div class="module" style="margin-top: 40px">
          <h3>告警配置</h3>
          <el-form-item label="日常检查告警">
            <el-switch v-model="form.alarm_config.daily_check.alarm_on"></el-switch>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="异常事件">
                <el-checkbox-group v-model="form.alarm_config.daily_check.except_alarm_by">
                  <el-checkbox label="sms">短信</el-checkbox>
                  <el-checkbox label="email">邮件</el-checkbox>
                  <el-checkbox label="wechat">微信</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="告警人">
                <el-select 
                  multiple
                  size="small"
                  v-model="form.alarm_config.daily_check.except_alarm_to">
                  <el-option
                    v-for="item in personList"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.id">
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="风险事件">
                <el-checkbox-group v-model="form.alarm_config.daily_check.risk_alarm_by">
                  <el-checkbox label="sms">短信</el-checkbox>
                  <el-checkbox label="email">邮件</el-checkbox>
                  <el-checkbox label="wechat">微信</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="告警人">
                <el-select 
                  multiple
                  size="small"
                  v-model="form.alarm_config.daily_check.risk_alarm_to">
                  <el-option
                    v-for="item in personList"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.id">
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <el-row>
            <el-col :span="4">
              <el-form-item label="定时作业告警">
                <el-switch v-model="form.alarm_config.timed_job.alarm_on"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="告警方式">
                <el-checkbox-group v-model="form.alarm_config.timed_job.alarm_by">
                  <el-checkbox label="sms">短信</el-checkbox>
                  <el-checkbox label="email">邮件</el-checkbox>
                  <el-checkbox label="wechat">微信</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="告警人">
                  <el-select 
                    multiple
                    size="small"
                    v-model="form.alarm_config.timed_job.alarm_to">
                    <el-option
                      v-for="item in personList"
                      :key="item.id"
                      :label="item.realname"
                      :value="item.id">
                  </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <el-row>
            <h3>交易时段配置</h3>
            <el-col>
              <el-form-item label="交易时段运维审批">
                <el-switch v-model="form.exchange_config.is_on"></el-switch>
              </el-form-item>
            </el-col>
           <br>
            <span style="display:inline-block;margin-right:50px;">交易时段</span>
             <el-time-picker
              is-range
              size="small"
              v-model="tranDateTime"
              value-format="hh:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>   
          </el-row>
        </div>
      </el-form>
    </div>

    <div class="btn-group">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%">
      <el-form ref="form-role" :model="role" label-width="80px" size="small">
        <el-form-item label="集群名称" prop="name">
          <el-input v-model="role.name" auto-complete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="role.description" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="dialogType === 'roleCreate'" type="primary" @click="addRole">确 定</el-button>
        <el-button v-else type="primary" @click="xgRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { cpostsysconfigs, getsysconfigs, getusername } from '@/api/systemManage/system.js'
import { Message } from 'element-ui'

const defaultRole = {
  name: '',
  description: ''
}
const formData = {
  'approve_config': {
    'config_on': false,
    'software_on': false,
    'script_on': false,
    'level': 'low'
  },
  'alarm_config': {
    'daily_check': {
      'alarm_on': false,
      'risk_alarm_to': [],
      'risk_alarm_by': [],
      'except_alarm_to': [],
      'except_alarm_by': []
    },
    'timed_job': {
      'alarm_to': [],
      'alarm_on': false,
      'alarm_by': []
    }
  },
  'business_config': [],
  'exchange_config': {
    'start_time': '',
    'is_on': false,
    'end_time': ''
  }
}
export default {
  name: 'config',
  components: {
    Breadcrumb
  },
  data() {
    return {
      role: {
        name: '',
        description: ''
      },
      dialogVisible: false,
      tableData: [],
      personList: [],
      multipleSelection: [],
      tranDateTime: '',
      name: '',
      description: '',
      tableLoading: false,
      dialogType: 'roleCreate',
      form: JSON.parse(JSON.stringify(formData))
    }
  },
  mounted() {
    getsysconfigs().then(res => {
      this.form = {
        'business_config': res.business_config,
        'approve_config': {
          'level': res.approve_config.level,
          'script_on': this.boolena1(res.approve_config.script_on),
          'software_on': this.boolena1(res.approve_config.software_on),
          'config_on': this.boolena1(res.approve_config.config_on)
        },
        'alarm_config': {
          'daily_check': {
            'alarm_on': this.boolena1(res.alarm_config.daily_check.alarm_on),
            'risk_alarm_to': res.alarm_config.daily_check.risk_alarm_to,
            'risk_alarm_by': res.alarm_config.daily_check.risk_alarm_by,
            'except_alarm_to': res.alarm_config.daily_check.except_alarm_to,
            'except_alarm_by': res.alarm_config.daily_check.except_alarm_by
          },
          'timed_job': {
            'alarm_to': res.alarm_config.timed_job.alarm_to,
            'alarm_on': this.boolena1(res.alarm_config.timed_job.alarm_on),
            'alarm_by': res.alarm_config.timed_job.alarm_by
          }
        },
        'exchange_config': {
          'start_time': res.exchange_config.start_time,
          'is_on': this.boolena1(res.exchange_config.is_on),
          'end_time': res.exchange_config.end_time
        }
      }
      this.tranDateTime = [res.exchange_config.start_time, res.exchange_config.end_time]
    }).catch(res => {
      console.log('失败', '2')
    })
  },
  created() {
    getusername().then(res => {
      this.personList = res
    }).catch(error => {
      Message.error(error)
    })
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case 'roleCreate':
          return '添加'
        case 'roleEdit':
          return '编辑'
      }
    }
  },
  methods: {
    submit(fromName) {
      this.$refs[fromName].validate((valid) => {
        // console.log(this.rolesid)

        if (valid) {
          // this.messageSuccess()
          this.dialogVisible = false
        }
      })
    },
    createRole() {
      this.role = { ...defaultRole }
      this.dialogType = 'roleCreate'
      this.dialogVisible = true
    },
    editRole() {
      this.role = this.multipleSelection[0]
      this.dialogType = 'roleEdit'
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    removeDomain() {
      for (var cvc in this.multipleSelection) {
        var index = this.form.business_config.indexOf(this.multipleSelection[cvc])
        if (index !== -1) {
          this.form.business_config.splice(index, 1)
        }
      }
    },
    formatterTime(row) {
      return this.$dayjs(row).format('HH:mm:ss')
    },
    boolena(val) {
      return val === false ? 0 : 1
    },
    boolena1(val) {
      return val === 1 ? true : false
    },
    low(val1) {
      if (val1 === '1') {
        return 'high'
      } else {
        if (val1 === '2') {
          return 'middle'
        } else {
          return 'low'
        }
      }
    },
    addRole() {
      this.form.business_config.push({
        'name': this.role.name,
        'description': this.role.description
      })
      this.dialogVisible = false
    },
    xgRole() {
      this.dialogVisible = false
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(formData))
    },
    submitForm(formName) {
      // alert( this.tranDateTime)
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            'business_config': this.form.business_config,
            'approve_config': {
              'level': this.form.approve_config.level,
              'script_on': this.boolena(this.form.approve_config.script_on),
              'software_on': this.boolena(this.form.approve_config.software_on),
              'config_on': this.boolena(this.form.approve_config.config_on)
            },
            'alarm_config': {
              'daily_check': {
                'alarm_on': this.boolena(this.form.alarm_config.daily_check.alarm_on),
                'risk_alarm_to': this.form.alarm_config.daily_check.risk_alarm_to,
                'risk_alarm_by': this.form.alarm_config.daily_check.risk_alarm_by,
                'except_alarm_to': this.form.alarm_config.daily_check.except_alarm_to,
                'except_alarm_by': this.form.alarm_config.daily_check.except_alarm_by
              },
              'timed_job': {
                'alarm_to': this.form.alarm_config.timed_job.alarm_to,
                'alarm_on': this.boolena(this.form.alarm_config.timed_job.alarm_on),
                'alarm_by': this.form.alarm_config.timed_job.alarm_by
              }
            },
            'exchange_config': {
              'start_time': this.tranDateTime[0],
              'is_on': this.boolena(this.form.exchange_config.is_on),
              'end_time': this.tranDateTime[1]
            }
          }
          cpostsysconfigs(params).then(res => {
            this.tableData = res.business_config
            Message.success('编辑成功！')
          }).catch((error) => {
            Message.error(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-config {
  .module {
    h3 {
      color: #333;
    }
    &.line,
    .line {
      border-top: 1px solid #e8e8e8;
      padding-top: 40px;
    }
  }

  .btn-group {
    margin: 0 0 60px 64px;
  }
}
</style>
