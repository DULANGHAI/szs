<template>
  <el-dialog title="条件编辑" :visible.sync="show">
    <!-- <el-form></el-form> -->
    <div>条件编辑</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {}
  },
  methods: {
    cancel() {},
    handleOk() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
