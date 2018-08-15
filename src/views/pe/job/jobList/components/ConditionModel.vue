<template>
  <el-dialog title="条件" :visible.sync="show" :show-close="false">
    <el-form>
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="请选择" :disabled="view === '1'">
          <el-option v-for="(item, index) in Object.keys(typeMap)" :key="index" :label="typeMap[item]" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表达式" v-if="form.type === 'include' || form.type === 'exclude'">
        <el-input v-model="form.value" :disabled="view === '1'"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="view !== '1'" type="primary" @click="handleOk" :disabled="!form.type">确 定</el-button>
      <el-button v-else @click="handleCancle">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    view: String,
    data: Object,
    show: {
      type: Boolean,
      default: false
    },
    addCondition: Function
  },
  data() {
    this.typeMap = {
      success: '成功',
      failed: '失败',
      include: '包含',
      exclude: '不包含'
    }
    return {
      form: {
        type: this.data.condition.type || '',
        value: this.data.condition.value || '',
        parent: this.data.parentstr
      }
    }
  },
  methods: {
    handleOk() {
      this.addCondition(this.form)
      this.$emit('update:show', false)
    },
    handleCancle() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
