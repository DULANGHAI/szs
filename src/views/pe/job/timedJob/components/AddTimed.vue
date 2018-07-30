<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="90px" size="small">
      <el-row v-if="type === 'add'">
        <el-col :span="11">
          <el-form-item label="作业名">
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
                <job-item :data="item"></job-item>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="定时作业名">
            <el-input v-model="form.name" placeholder="请输入" :disabled="type !== 'add'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="账号" label-width="60px">
            <el-select v-model="form.execution_account" placeholder="请选择">
              <el-option v-for="(item, index) in account_arr" :key="index" :label="item" :value="item"></el-option>
            </el-select>
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
          <el-form-item label="目标IP" label-width="60px">
            <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="定时配置">
            <el-radio-group v-model="form.timed_type">
              <el-radio v-for="(item, index) in Object.keys(timed_type_map)" :key="index" :label="item">{{timed_type_map[item]}}</el-radio>
            </el-radio-group>
            <div v-show="form.timed_type === 'check'">
              <choose-timed ref="chooseTimed"></choose-timed>
            </div>
            <div v-show="form.timed_type !== 'check'">
              <custom-timed ref="customTimed"></custom-timed>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="重试次数">
            <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="1"></el-input-number>
            次
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="启用">
            <el-switch v-model="form.status" :disabled="type !== 'add'"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

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

export default {
  props: {
    type: String,
    data: Object
  },
  components: {
    JobItem,
    Treeselect,
    ChooseTimed,
    CustomTimed
  },
  data() {
    this.timed_type_map = {
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
        timed_type: 'check',
        timed_expression: '',
        frequency: '',
        status: ''
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
      account_arr: ['account1', 'account2'],
      options: [
        {
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa'
            },
            {
              id: 'ab',
              label: 'ab'
            }
          ]
        },
        {
          id: 'b',
          label: 'b'
        },
        {
          id: 'c',
          label: 'c'
        }
      ],
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
      this.form.job_id = val.id
      this.form.execution_account = val.execution_account
      this.form.description = val.description
      this.form.target_ip = JSON.parse(val.target_ip).host
    }
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
      console.log('open callback ' + this.type)
    },
    handleClose() {
      console.log('close callback ')
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
        target_ip: JSON.parse(this.data.target_ip).host,
        timed_type: this.data.timed_type,
        timed_expression: this.data.timed_expression,
        frequency: this.data.frequency,
        status: this.data.status
      }
      this.$nextTick(() => {
        if (this.data.timed_type === 'check') {
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
    cancel() {
      this.show = false
    },
    submit() {
      let express = ''
      if (this.form.timed_type === 'check') {
        express = this.$refs.chooseTimed.getExpress()
      } else {
        express = this.$refs.customTimed.getExpress()
      }
      if (this.type === 'add') {
        const data = {
          'status': this.form.status,
          'job_id': this.form.job_id,
          'execution_account': this.form.execution_account,
          'timed_expression': express,
          'name': this.form.name,
          'frequency': this.form.frequency,
          'target_ip': JSON.stringify({
            host: this.form.target_ip
          }),
          'timed_type': this.form.timed_type,
          'description': this.form.description
        }
        createJobApi(data).then(res => {
          this.cancel()
        })
      } else {
        const data = {
          'description': this.form.description,
          'execution_account': this.form.execution_account,
          'timed_expression': express,
          'scheduling': this.data.scheduling,
          'frequency': this.form.frequency,
          'target_ip': JSON.stringify({
            host: this.form.target_ip
          }),
          'timed_type': this.form.timed_type

        }
        updateJobApi(this.data.id, data).then(res => {
          this.cancel()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

