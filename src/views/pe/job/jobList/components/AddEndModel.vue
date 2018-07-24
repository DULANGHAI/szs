<template>
  <el-dialog title="结束节点" :visible.sync="show" :show-close="false">
    <el-form :label-position="'top'" label-width="80px">
      <el-form-item label="作业类型">
        <el-select v-model="form.type">
          <el-option value="end_success">执行成功</el-option>
          <el-option value="end_failed">执行失败</el-option>
          <el-option value="end_rollback">执行失败但回滚成功</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="是否告警">
        <el-switch v-model="form.is_warning"></el-switch>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleOk" :disabled="!form.type">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    addNode: Function
  },
  data() {
    return {
      form: {
        type: '',
        description: '',
        is_warning: true,
        timestr: +new Date(),
        next: []
      }
    }
  },
  methods: {
    cancel() {
      this.form = {
        type: '',
        description: '',
        is_warning: true
      }
      this.$emit('update:show', false)
    },
    handleOk() {
      this.addNode(this.form)
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
