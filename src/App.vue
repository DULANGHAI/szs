<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// 脚本选择下拉框的样式，不要删除
.script-select /deep/ .el-select-dropdown__item {
  height: 65px;
  line-height: initial;
}
</style>
