<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :model="form" ref="form" :rules="rules" :label-position="'left'" label-width="100px" size="small">
      <el-row v-if="type === 'add'">
        <el-col :span="11">
          <el-form-item label="作业名" prop="job_id">
            <el-select value-key="id" v-model="selectJob" placeholder="请选择"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
              popper-class="script-select"
              :loading="loading"
              @focus="firstData"
              @change="change">
              <el-option v-for="(item, index) in jobArr" :key="index" :label="item.name" :value="item">
                <job-item :data="item" :selected="selectJob"></job-item>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="定时作业名" prop="name">
            <el-input v-model="form.name" placeholder="请输入" :disabled="type !== 'add'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2" prop="execution_account">
          <el-form-item label="账号" label-width="80px">
            <el-input v-model="form.execution_account" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="目标IP" label-width="80px" prop="target_ip">
            <treeselect v-model="form.target_ip" :multiple="true" search-nested :options="options" placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="定时类型">
            <el-radio-group v-model="form.timed_type">
              <el-radio v-for="(item, index) in Object.keys(timed_type_map)" :key="index" :label="item">{{timed_type_map[item]}}</el-radio>
            </el-radio-group>
            <div v-show="form.timed_type === 'timed'">
              <el-date-picker
                v-model="form.timed_date"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-show="form.timed_type === 'cycle'">
        <el-col>
          <el-form-item label="定时配置">
            <el-radio-group v-model="form.timed_config">
              <el-radio v-for="(item, index) in Object.keys(timed_config_map)" :key="index" :label="item">{{timed_config_map[item]}}</el-radio>
            </el-radio-group>
            <div v-show="form.timed_config === 'check'">
              <choose-timed ref="chooseTimed"></choose-timed>
            </div>
            <div v-show="form.timed_config !== 'check'">
              <custom-timed ref="customTimed"></custom-timed>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="重试次数" prop="frequency">
            <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="0"></el-input-number>
            次
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="11">
          <el-form-item label="启用">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0" :disabled="type !== 'add'"></el-switch>
          </el-form-item>
        </el-col>
      </el-row> -->

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JobItem from '@/views/pe/job/instantJob/components/JobItem'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ChooseTimed from './ChooseTimed'
import CustomTimed from './CustomTimed'

import { getJobListApi } from '@/api/pe/jobManage/instantJob'
import { createJobApi, updateJobApi } from '@/api/pe/jobManage/timedJob'
import { getIpApi } from '@/api/pe/common/index'

export default {
  props: {
    type: String,
    data: Object,
    refresh: Function
  },
  components: {
    JobItem,
    Treeselect,
    ChooseTimed,
    CustomTimed
  },
  data() {
    this.timed_type_map = {
      cycle: '周期',
      timed: '定时'
    }
    this.timed_config_map = {
      check: '勾选',
      custom: '自定义'
    }

    return {
      show: false,
      form: {
        job_id: '',
        name: '',
        execution_account: '',
        description: '',
        target_ip: [],
        timed_type: 'cycle',
        timed_config: 'check',
        timed_date: '',
        timed_expression: '',
        frequency: '',
        status: 0
      },
      rules: {
        job_id: [
          { required: true, message: '请选择作业', trigger: ['change'] }
        ],
        name: [
          { required: true, message: '请输入定时作业名', trigger: ['blur', 'change'] }
        ],
        execution_account: [
          { required: true, message: '请输入账号', trigger: ['blur', 'change'] }
        ],
        target_ip: [
          { required: true, message: '请选择目标IP', trigger: ['change'] }
        ],
        frequency: [
          { required: true, message: '请输入重试次数', trigger: ['blur', 'change'] }
        ]
      },
      // 用来查询作业的参数
      jobform: {
        name: '',
        type: '',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        page: 1,
        per_page: 10
      },
      jobArr: [],
      selectJob: {},
      options: [],
      loading: false
    }
  },
  computed: {
    title() {
      if (this.type === 'edit') {
        return '定时作业配置'
      } else {
        return '添加定时作业'
      }
    }
  },
  watch: {
    selectJob(val) {
      if (!val.id) {
        return
      }
      this.form.job_id = val.id
      this.form.execution_account = val.execution_account
      this.form.description = val.description
      this.form.target_ip = val.target_ip.split(',')
    }
  },
  created() {
    getIpApi().then(res => {
      this.options = res
    })
  },
  methods: {
    showMoel() {
      this.show = true
    },
    hideModel() {
      this.show = false
    },
    handleOpen() {
      if (this.type === 'add') {
        this.init()
      } else {
        this.initEdit()
      }
    },
    handleClose() {
    },
    init() {

    },
    initEdit() {
      // 编辑时，已经选的作业和定时作业名不能更改
      // 赋值
      this.form = {
        job_id: this.data.job_id,
        name: this.data.name,
        execution_account: this.data.execution_account,
        description: this.data.description,
        target_ip: this.data.target_ip.split(','),
        timed_type: this.data.timed_type,
        timed_config: this.data.timed_config,
        timed_date: this.data.timed_date,
        timed_expression: this.data.timed_expression,
        frequency: this.data.frequency,
        status: this.data.status
      }
      this.$nextTick(() => {
        if (this.data.timed_config === 'check') {
          this.$refs.chooseTimed.setExpress(this.data.timed_expression)
        } else {
          this.$refs.customTimed.setExpress(this.data.timed_expression)
        }
      })
    },
    firstData(e) {
      this.loading = true
      this.jobform.name = e.target.value
      getJobListApi(this.jobform).then(res => {
        this.loading = false
        this.jobArr = res.items
      }).catch(() => {
        this.loading = false
        this.jobArr = []
      })
    },
    remoteMethod(query) {
      this.loading = true
      this.jobform.name = query
      getJobListApi(this.jobform).then(res => {
        this.loading = false
        this.jobArr = res.items
      }).catch(() => {
        this.loading = false
        this.jobArr = []
      })
    },
    change(val) {
      for (let i = 0; i < this.jobArr.length; i++) {
        if (this.jobArr[i].name === val) {
          this.selectedObj = this.jobArr[i]
          break
        }
      }
    },
    timedTypeChange(val) {

    },
    cancel() {
      this.form = {
        job_id: '',
        name: '',
        execution_account: '',
        description: '',
        target_ip: [],
        timed_type: 'cycle',
        timed_config: 'check',
        timed_date: '',
        timed_expression: '',
        frequency: '',
        status: 0
      }
      this.jobform = {
        name: '',
        type: '',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        page: 1,
        per_page: 10
      }
      this.jobArr = []
      this.selectJob = {}

      this.$refs.chooseTimed.reset()
      this.$refs.customTimed.reset()

      this.$refs.form.resetFields()

      this.show = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.timed_type === 'timed' && !this.form.timed_date) {
            this.$message.error('日期不能为空')
            return
          }

          let express = ''
          if (this.form.timed_config === 'check') {
            express = this.$refs.chooseTimed.getExpress()
          } else {
            express = this.$refs.customTimed.getExpress()
          }
          if (this.form.timed_type === 'cycle' && (express === '* * * * *' || express === '')) {
            this.$message.error('表达式不能为空')
            return
          }
          if (this.type === 'add') {
            const data = {
              'status': this.form.status,
              'job_id': this.form.job_id,
              'execution_account': this.form.execution_account,
              'timed_expression': express,
              'timed_date': this.form.timed_date,
              'name': this.form.name,
              'frequency': this.form.frequency,
              'target_ip': this.form.target_ip,
              'timed_config': this.form.timed_config,
              'timed_type': this.form.timed_type,
              'description': this.form.description
            }
            if (data.timed_type === 'cycle') {
              data.timed_date = ''
            } else {
              data.timed_expression = ''
            }
            createJobApi(data).then(res => {
              this.refresh(1)
              this.cancel()
            })
          } else {
            const data = {
              'description': this.form.description,
              'execution_account': this.form.execution_account,
              'timed_expression': express,
              'timed_date': this.form.timed_date,
              'scheduling': this.data.scheduling,
              'frequency': this.form.frequency,
              'target_ip': this.form.target_ip,
              'timed_config': this.form.timed_config,
              'timed_type': this.form.timed_type
            }
            if (data.timed_type === 'cycle') {
              data.timed_date = ''
            } else {
              data.timed_expression = ''
            }
            updateJobApi(this.data.id, data).then(res => {
              this.refresh()
              this.cancel()
            })
          }
          // fenge
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

