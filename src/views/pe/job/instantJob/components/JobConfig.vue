<template>
  <el-dialog title="任务配置" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="90px" size="small">
      <el-form-item label="账号" label-width="60px">
        <el-input v-model="form.execution_account" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="目标IP" label-width="60px">
        <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="重试次数">
        <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="1"></el-input-number>
        次
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { updateJobApi } from '@/api/pe/jobManage/instantJob'

export default {
  props: {
    data: Object,
    refresh: Function
  },
  components: {
    Treeselect
  },
  data() {
    return {
      show: false,
      uniqueId: +new Date(),
      form: {
        execution_account: '',
        target_ip: [],
        frequency: ''
      },
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
          id: '10.111.2.40',
          label: '10.111.2.40'
        }
      ]
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
      this.form = {
        execution_account: this.data.execution_account,
        target_ip: JSON.parse(this.data.target_ip).host,
        frequency: this.data.frequency
      }
      this.uniqueId = +new Date()
      console.log('open callback ')
    },
    handleClose() {
      console.log('close callback ')
    },
    init() {

    },
    /**
     * 提交
     */
    submit() {
      const data = {
        'target_ip': JSON.stringify({ host: this.form.target_ip }),
        'scheduling': this.data.scheduling,
        'frequency': this.form.frequency,
        'execution_account': this.form.execution_account

      }
      updateJobApi(this.data.id, data).then(res => {
        this.refresh()
        this.cancel()
      })
    },
    cancel() {
      this.show = false
      this.uniqueId = +new Date()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
