<template>
  <el-dialog title="人工流程" :visible="show" :show-close="false" :width="'600px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="100px" size="small">
      <el-form-item label="节点名称">
        <el-input v-model="form.name" placeholder="请输入" :disabled="view === '1'"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="通知人">
        <el-select v-model="form.notifier" placeholder="请选择" :disabled="view === '1'">
          <el-option value="假数据1"></el-option>
          <el-option value="假数据2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-radio-group v-model="form.notify_type" :disabled="view === '1'">
          <el-radio label="message">message</el-radio>
          <el-radio label="mail">mail</el-radio>
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

export default {
  props: {
    view: String,
    data: Object,
    refresh: Function,
    addManualData: Function
  },
  data() {
    return {
      show: false,
      form: {
        job_type: 'manual',
        name: '',
        description: '',
        notifier: '',
        notify_type: 'message',
        timestr: ''
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
        if (this.data && this.data.job_type === 'manual') {
          const result = this.data
          result.name = this.form.name
          result.description = this.form.description
          result.notifier = this.form.notifier
          result.notify_type = this.form.notify_type
          this.$emit('update:data', result)

          this.refresh()
        } else {
          this.addManualData(this.form)
        }
      }

      this.cancel()
    },
    cancel() {
      this.show = false
      this.form = {
        job_type: 'manual',
        name: '',
        description: '',
        notifier: '',
        notify_type: 'message',
        timestr: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
