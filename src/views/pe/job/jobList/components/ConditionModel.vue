<template>
  <el-dialog title="条件编辑" :visible.sync="show" :show-close="false">
    <el-form>
      <el-form-item label="表达式">
        <el-input v-model="data.condition"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    data: Object,
    show: {
      type: Boolean,
      default: false
    },
    addCondition: Function
  },
  data() {
    return {}
  },
  methods: {
    cancel() {
      this.$emit('update:show', false)
    },
    handleOk() {
      this.addCondition()
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
