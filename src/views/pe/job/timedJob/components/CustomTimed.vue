<template>
  <div>
    <el-row>
      <el-col :span="11">
        <el-form-item label="">
          <el-input v-model="express" placeholder="表达式"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div>例如：0 0 1,15 * 1 毎月1日和 15日和 一日的 0:00 执行</div>

    <div class="step-container">
      <el-steps>
        <el-step title="minute" description="从0到59的整数">
          <span class="num" slot="icon">0</span>
        </el-step>
        <el-step title="hour" description="从0到59的整数">
          <span class="num" slot="icon">0</span>
        </el-step>
        <el-step title="day" description="从1到31的整数 (必须是指定月份的有效日期)">
          <span class="num" slot="icon">1,15</span>
        </el-step>
        <el-step title="month" description="从1到12的整数 (或如Jan或Feb简写的月份)">
          <span class="num" slot="icon">*</span>
        </el-step>
        <el-step title="dayofweek" description="从0到6的整数，0用来描述周日 (或用Sun或Mon简写来表示)">
          <span class="num" slot="icon">1</span>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      express: ''
    }
  },
  methods: {
    getExpress() {
      return this.express
    },
    setExpress(str) {
      this.express = str
    }
  }
}
</script>

<style lang="scss" scoped>
.step-container {
  & /deep/ .el-step__icon.is-text {
    border: none
  }
  & /deep/ .el-step__line {
    display: none;
  }
  & /deep/ .num {
    color: #606266;
  }
}
</style>
