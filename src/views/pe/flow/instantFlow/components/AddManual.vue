<template>
  <el-dialog title="人工流程" :visible="show" :show-close="false" :width="'600px'"
    @open="handleOpen" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" :label-position="'left'" label-width="100px" size="small">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" :disabled="view === '1'"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="通知人" prop="notifier">
        <el-select v-model="form.notifier" placeholder="请选择" :disabled="view === '1'">
          <el-option v-for="item in notifier_arr" :key="item.id" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知方式" prop="notify_type">
        <el-radio-group v-model="form.notify_type" :disabled="view === '1'">
          <el-radio v-for="(item, index) in Object.keys(notify_type_map)" :key="index" :label="item">{{notify_type_map[item]}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="!view" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserApi } from '@/api/pe/common/index'
import { updateFlowApi } from '@/api/pe/flowManage/instantFlow'

export default {
  props: {
    view: String,
    data: Object,
    refresh: Function,
    addManualData: Function
  },
  data() {
    this.notify_type_map = {
      'email': '邮件',
      'sms': '短信',
      'wechat': '微信'
    }
    return {
      show: false,
      form: {
        job_type: 'manual',
        name: '',
        description: '',
        notifier: '',
        notify_type: 'email',
        timestr: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        notifier: [
          { required: true, message: '请输入选择通知人', trigger: ['blur', 'change'] }
        ],
        notify_type: [
          { required: true, message: '请输入选择通方式', trigger: ['change'] }
        ]
      },
      notifier_arr: []
    }
  },
  created() {
    getUserApi().then(res => {
      this.notifier_arr = res
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
      if (this.data && this.data.job_type === 'manual') {
        this.form = {
          job_type: 'manual',
          name: this.data.name,
          description: this.data.description,
          notifier: this.data.notifier,
          notify_type: this.data.notify_type,
          timestr: this.data.timestr
        }
      } else {
        this.form.timestr = +new Date()
      }
    },
    handleClose() {
    },
    init() {

    },
    /**
     * 提交
     */
    submit() {
      this.$refs.form.validate((valide) => {
        if (valide) {
          if (!this.view) {
            if (this.data && this.data.job_type === 'manual') {
              const result = this.data
              result.name = this.form.name
              result.description = this.form.description
              result.notifier = this.form.notifier
              result.notify_type = this.form.notify_type

              const temp = this.deleteAttr(result.parent.scheduling)
              // this.$emit('update:data', result)
              updateFlowApi(result.parent.id, {
                scheduling: JSON.stringify(temp)
              }).then(() => {
                this.cancel()
                this.refresh()
              })
            } else {
              this.addManualData(this.form)
              this.cancel()
            }
          }
        }
      })
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
      this.form = {
        job_type: 'manual',
        name: '',
        description: '',
        notifier: '',
        notify_type: 'email',
        timestr: ''
      }
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
