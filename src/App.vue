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

// 各种颜色小圆圈
.dark-circle {
  display: inline-block;
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background: #D9D9D9;
}
.green-circle {
  display: inline-block;
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background: #52C41A;
}
.red-circle {
  display: inline-block;
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background: #F5222D;
}

// 颜色
.active-blue {
  color: #46a1ff;
}
</style>
