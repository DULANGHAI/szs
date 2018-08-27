<template>
  <el-dialog title="作业配置" :visible="show" :show-close="false" :width="'600px'"
    @open="handleOpen" @close="handleClose">
    <el-form :model="form" ref="form" :rules="rules" :label-position="'left'" label-width="100px" size="small">
      <el-form-item label="账号" prop="execution_account">
        <el-input v-model="form.execution_account" placeholder="请输入" :disabled="view === '1'"></el-input>
      </el-form-item>
      <el-form-item label="目标IP" prop="target_ip">
        <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" :disabled="view === '1'" />
      </el-form-item>
      <el-form-item label="重试次数" prop="frequency">
        <el-input-number v-model="form.frequency" controls-position="right" :min="1" :precision="1" :disabled="view === '1'"></el-input-number>
        次
      </el-form-item>
      <el-form-item label="失败处理方式" prop="handleFailed">
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
import { updateFlowApi } from '@/api/pe/flowManage/instantFlow'

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
      rules: {
        execution_account: [
          { required: true, message: '请输入账号', trigger: ['blur', 'change'] }
        ],
        target_ip: [
          { required: true, message: '请选择目标IP', trigger: ['change'] }
        ],
        frequency: [
          { required: true, message: '请输入重试次数', trigger: ['blur', 'change'] }
        ],
        handleFailed: [
          { required: true, message: '请选择失败处理方式', trigger: ['change'] }
        ]
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
        target_ip: this.data.target_ip.split(','),
        frequency: this.data.frequency,
        handleFailed: this.data.handleFailed
      }
      this.uniqueId = +new Date()
    },
    handleClose() {
    },
    init() {

    },
    /**
     * 提交
     */
    submit() {
      if (!this.view) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const result = this.data

            result.execution_account = this.form.execution_account
            result.target_ip = this.form.target_ip.join(',')
            result.frequency = this.form.frequency
            result.handleFailed = this.form.handleFailed

            // this.$emit('update:data', result)
            const temp = this.deleteAttr(result.parent.scheduling)
            // this.$emit('update:data', result)
            updateFlowApi(result.parent.id, {
              scheduling: JSON.stringify(temp)
            }).then(() => {
              this.cancel()
              this.refresh()
            })
          }
        })
      }
      this.cancel()
    },
    deleteAttr(obj) {
      const objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && key !== '_expanded' && key !== '_level' && key !== '_show' && key !== 'parent') {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deleteAttr(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
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
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
