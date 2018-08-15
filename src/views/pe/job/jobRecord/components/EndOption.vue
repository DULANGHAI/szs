<template>
  <div class="end-option" :class="data.type"
    :uniqueId="uniqueId">
    {{textMap[data.type]}}
  </div>
</template>

<script>
const textMap = {
  'end_success': '执行成功',
  'end_failed': '执行失败',
  'end_rollback': '执行失败但回滚成功'
}
export default {
  props: {
    uniqueId: Number,
    data: {
      type: Object
    }
  },
  data() {
    return {
      textMap: textMap
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.end-option {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.end_success {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.end_failed, .end_rollback {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.selected {
  border-color: #1890FF;
}
</style>
