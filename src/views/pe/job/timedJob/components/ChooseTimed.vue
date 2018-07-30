<template>
  <div class="choose-container">

    <el-tabs type="border-card">
      <el-tab-pane label="分钟">
        <div class="tab-item">
          <el-form-item label="">
            <el-radio-group v-model="minute_type">
              <el-radio :label="'every'">每分钟</el-radio>
              <el-radio :label="'choose'">指定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-checkbox-group v-model="minute">
            <el-checkbox v-for="n in 60" :key="n" :label="(n - 1) + ''" :disabled="minute_type === 'every'"></el-checkbox>
          </el-checkbox-group>
          <div class="express">{{'表达式：' + express}}</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="小时">
        <div class="tab-item">
          <el-form-item label="">
            <el-radio-group v-model="hour_type">
              <el-radio :label="'every'">每小时</el-radio>
              <el-radio :label="'choose'">指定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-checkbox-group v-model="hour">
            <el-checkbox v-for="n in 24" :key="n" :label="(n - 1) + ''" :disabled="hour_type === 'every'"></el-checkbox>
          </el-checkbox-group>
          <div class="express">{{'表达式：' + express}}</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="天">
        <div class="tab-item">
          <el-form-item label="">
            <el-radio-group v-model="day_type">
              <el-radio :label="'every'">每天</el-radio>
              <el-radio :label="'choose'">指定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-checkbox-group v-model="day">
            <el-checkbox v-for="n in 31" :key="n" :label="n + ''" :disabled="day_type === 'every'"></el-checkbox>
          </el-checkbox-group>
          <div class="express">{{'表达式：' + express}}</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="月">
        <div class="tab-item">
          <el-form-item label="">
            <el-radio-group v-model="month_type">
              <el-radio :label="'every'">每月</el-radio>
              <el-radio :label="'choose'">指定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-checkbox-group v-model="month">
            <el-checkbox v-for="n in 12" :key="n" :label="n + ''" :disabled="month_type === 'every'"></el-checkbox>
          </el-checkbox-group>
          <div class="express">{{'表达式：' + express}}</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="星期">
        <div class="tab-item">
          <el-form-item label="">
            <el-radio-group v-model="dayofweek_type">
              <el-radio :label="'every'">每星期</el-radio>
              <el-radio :label="'choose'">指定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-checkbox-group v-model="dayofweek">
            <el-checkbox v-for="n in 7" :key="n" :label="(n - 1) + ''" :disabled="dayofweek_type === 'every'"></el-checkbox>
          </el-checkbox-group>
          <div class="express">{{'表达式：' + express}}</div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
      minute_type: 'every',
      minute: [],
      hour_type: 'every',
      hour: [],
      day_type: 'every',
      day: [],
      month_type: 'every',
      month: [],
      dayofweek_type: 'every',
      dayofweek: []
    }
  },
  computed: {
    express() {
      try {
        const arr = []
        // 分钟
        if (this.minute_type === 'every' ||
          (this.minute.length === 0 && this.minute_type !== 'every')) {
          arr.push('*')
        } else {
          arr.push(this.minute.sort().toString())
        }

        // 小时
        if (this.hour_type === 'every' ||
          (this.hour.length === 0 && this.hour_type !== 'every')) {
          arr.push('*')
        } else {
          arr.push(this.hour.sort().toString())
        }

        // 日期
        if (this.day_type === 'every' ||
          (this.day.length === 0 && this.day_type !== 'every')) {
          arr.push('*')
        } else {
          arr.push(this.day.sort().toString())
        }

        // 月份
        if (this.month_type === 'every' ||
          (this.month.length === 0 && this.month_type !== 'every')) {
          arr.push('*')
        } else {
          arr.push(this.month.sort().toString())
        }

        // 星期
        if (this.dayofweek_type === 'every' ||
          (this.dayofweek.length === 0 && this.dayofweek_type !== 'every')) {
          arr.push('*')
        } else {
          arr.push(this.dayofweek.sort().toString())
        }

        return arr.join(' ')
      } catch (e) {
        return ''
      }
    }
  },
  methods: {
    getExpress() {
      return this.express
    },
    setExpress(str) {
      if (str) {
        const arr1 = str.split(' ')
        // 先判断数据长度够不够
        if (arr1.length !== 5) {
          this.$message.error('表达式数据异常')
          return
        } else {
          // 分钟
          if (arr1[0] === '*') {
            this.minute_type = 'every'
            this.minute = []
          } else {
            this.minute_type = 'choose'
            this.minute = arr1[0].split(',')
          }
          // 小时
          if (arr1[1] === '*') {
            this.hour_type = 'every'
            this.hour = []
          } else {
            this.hour_type = 'choose'
            this.hour = arr1[1].split(',')
          }
          // 日期
          if (arr1[2] === '*') {
            this.day_type = 'every'
            this.day = []
          } else {
            this.day_type = 'choose'
            this.day = arr1[2].split(',')
          }
          // 月份
          if (arr1[3] === '*') {
            this.month_type = 'every'
            this.month = []
          } else {
            this.month_type = 'choose'
            this.month = arr1[3].split(',')
          }
          // 星期
          if (arr1[4] === '*') {
            this.dayofweek_type = 'every'
            this.dayofweek = []
          } else {
            this.dayofweek_type = 'choose'
            this.dayofweek = arr1[4].split(',')
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-container {
  & /deep/ .el-tabs--border-card {
    box-shadow: none;
  }
  .tab-item {
    & .el-checkbox:first-child {
      margin-left: 30px;
    }
  }
}

</style>
