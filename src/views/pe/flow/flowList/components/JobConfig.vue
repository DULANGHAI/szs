<template>
  <el-dialog title="作业配置" :visible="show" :show-close="false" :width="'600px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="100px" size="small">
      <el-form-item label="账号">
        <el-input v-model="form.execution_account" placeholder="请输入" :disabled="view === '1'"></el-input>
      </el-form-item>
      <el-form-item label="目标IP">
        <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" :disabled="view === '1'" />
      </el-form-item>
      <el-form-item label="重试次数">
        <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="1" :disabled="view === '1'"></el-input-number>
        次
      </el-form-item>
      <el-form-item label="失败处理方式">
        <el-select v-model="form.handleFailed" placeholder="请选择" :disabled="view === '1'">
          <el-option v-for="(item, index) in Object.keys(handleFailed_map)" :key="index" :label="handleFailed_map[item]" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="!view" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getIpApi } from '@/api/pe/common/index'

export default {
  props: {
    view: String,
    data: Object,
    refresh: Function
  },
  components: {
    Treeselect
  },
  data() {
    this.handleFailed_map = {
      'stop': '暂停',
      'continue': '继续下一个作业'
    }
    return {
      show: false,
      uniqueId: +new Date(),
      form: {
        execution_account: '',
        target_ip: [],
        frequency: '',
        handleFailed: ''
      },
      options: []
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
      this.form = {
        execution_account: this.data.execution_account,
        target_ip: JSON.parse(this.data.target_ip).host,
        frequency: this.data.frequency,
        handleFailed: this.data.handleFailed
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
      if (!this.view) {
        const result = this.data

        result.execution_account = this.form.execution_account
        result.target_ip = JSON.stringify({ host: this.form.target_ip })
        result.frequency = this.form.frequency
        result.handleFailed = this.form.handleFailed

        this.$emit('update:data', result)

        this.refresh()
      }
      this.cancel()
    },
    cancel() {
      this.show = false
      this.uniqueId = +new Date()
      this.form = {
        execution_account: '',
        target_ip: [],
        frequency: '',
        handleFailed: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
