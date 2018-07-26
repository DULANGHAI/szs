<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="90px" size="small">
      <el-row>
        <el-col :span="11">
          <el-form-item label="作业名">
            <el-select value-key="id" v-model="selectJob" placeholder="请选择">
              <el-option v-for="(item, index) in job_arr" :key="index" :label="item.name" :value="item">
                <job-item :data="item"></job-item>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="定时作业名">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
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
            <el-input v-model="form.description" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="目标IP" label-width="60px">
            <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
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
          <el-form-item label="重试次数">
            <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="1"></el-input-number>
            次
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JobItem from '@/views/pe/job/instantJob/components/JobItem'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  props: {
    type: String
  },
  components: {
    JobItem,
    Treeselect
  },
  data() {
    return {
      show: false,
      form: {
        job_id: '',
        name: '',
        execution_account: '',
        description: '',
        target_ip: [],
        timed_config: '',
        timed_type: '',
        timed_expression: '',
        frequency: '',
        status: ''
      },
      job_arr: [],
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
      ]
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
      }
      console.log('open callback ' + this.type)
    },
    handleClose() {
      console.log('close callback ')
    },
    init() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>

