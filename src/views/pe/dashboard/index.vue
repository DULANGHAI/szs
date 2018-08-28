<template>
  <div class="dashboard">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="dash-body" v-loading="loading">
      <div class="dash-header">
        <div class="dash-title">运维作业仪表盘</div>
        <div class="header-flex">
          <div class="dash-desc">{{`早上好，${name}，欢迎来到上证信息运维自动化平台`}}</div>
          <el-form :inline="true" :model="form">
            <el-form-item label="时间">
              <el-date-picker
                size="small"
                v-model="datetimerange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="false"
                popper-class="no-clear"
                @change="handleTimeChange"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="定时刷新">
              <el-switch v-model="timed" @change="handleChange"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        
      </div>
      <div class="dash-card">
        <div class="card-panel panel-bg-01">
          <div><svg-icon icon-class="da-job" style="margin-right:10px;"/>作业</div>
          <div class="card-fcount">
            <span>
              <div>作业执行数</div>
              <div class="ft-sz">{{jobCard.count}}</div>
            </span>
            <span>
              <div>成功率</div>
              <div class="ft-sz">{{jobCard.ratio}}</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-02">
          <div><svg-icon icon-class="da-flow" style="margin-right:10px;"/>流程</div>
          <div class="card-fcount">
            <span>
              <div>流程执行数</div>
              <div class="ft-sz">{{flowCard.count}}</div>
            </span>
            <span>
              <div>成功率</div>
              <div class="ft-sz">{{flowCard.ratio}}</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-03">
          <div><svg-icon icon-class="da-check" style="margin-right:10px;"/>日常检查</div>
          <div class="card-fcount">
            <span>
              <div>正常主机数</div>
              <div class="ft-sz">{{checkCard.normal_count}}</div>
            </span>
            <span>
              <div>异常主机数</div>
              <div class="ft-sz">{{checkCard.abnormal_count}}</div>
            </span>
          </div>
        </div>
      </div>
      <!-- 折线图 -->
      <div class="line-chart">
        <!-- 作业量统计 -->
        <div class="v-line">
          <ve-line
            :data="chartData1"
            :colors="colors"
            :grid="grid"
            :extend="extend1">
            <div v-show="!chartData1.rows.length" class="data-empty">暂无数据</div>
            </ve-line>
        </div>
        <div class="width-20"></div>
        <!-- 流程执行统计 -->
        <div class="v-line">
          <ve-line
            :data="chartData2"
            :colors="colors"
            :grid="grid"
            :extend="extend2">
            <div v-show="!chartData2.rows.length" class="data-empty">暂无数据</div>
            </ve-line>
        </div>
      </div>

      <!-- top -->
      <div class="top-chart">
        <!-- top10异常主机 -->
        <div class="v-top top10-container">
          <ve-histogram
            :data="chartData3"
            :settings="chartSettings3"
            :extend="extend3">
            <div v-show="!chartData3.rows.length" class="data-empty">暂无数据</div>
            </ve-histogram>
        </div>
        <div class="width-20"></div>
        <!-- top5作业 -->
        <div class="v-top top5-container">
          <ve-ring
            :data="chartData4"
            :grid="grid"
            :settings="chartSettings4"
            :extend="extend4">
            <div v-show="!chartData4.rows.length" class="data-empty">暂无数据</div>
            </ve-ring>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import dayjs from 'dayjs'

import { getJobCardDataApi, getFlowCardDataApi, getFlowChartDataApi, getJobChartDataApi, getHostChartDataApi } from '@/api/pe/dashboard/index'

const default_start_time = dayjs().subtract(8, 'day').format('YYYY-MM-DD HH:mm:ss')
const default_end_time = dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')

export default {
  components: {
    Breadcrumb
  },
  data() {
    this.colors = ['#874DA2', '#09BBFF']
    this.grid = {
      show: false,
      bottom: 20,
      containLabel: true
    }
    this.extend1 = {
      title: {
        text: '作业量统计'
      },
      legend: {
        data: [
          {
            name: '失败数',
            icon: 'circle'
          },
          {
            name: '成功数',
            icon: 'circle'
          }
        ]
      }
    }
    this.extend2 = {
      title: {
        text: '流程执行统计'
      },
      legend: {
        data: [
          {
            name: '失败数',
            icon: 'circle'
          },
          {
            name: '成功数',
            icon: 'circle'
          }
        ]
      }
    }
    this.extend3 = {
      title: {
        text: 'TOP10异常主机'
      },
      legend: {
        show: false
      },
      series: {
        barWidth: 20
      },
      grid: {
        show: false,
        bottom: 20,
        containLabel: true
      },
      xAxis: {
        axisLabel: {
          rotate: 45
        }
      }
    }
    this.chartSettings3 = {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#2A89FF' },
          { offset: 1, color: '#09BBFF' }
        ])
      }
    }
    this.extend4 = {
      title: {
        text: 'TOP5作业'
      },
      colors: ['#2A89FF', '#11AD68', '#444753', '#5F72BD', '#C79081'],
      legend: {
        bottom: 20
      }
    }
    this.chartSettings4 = {
      label: {
        show: false
      }
    }
    return {
      loading: false,
      form: {
        start_time: default_start_time,
        end_time: default_end_time
      },
      datetimerange: [default_start_time, default_end_time],
      timed: false,
      jobCard: {
        count: 0,
        ratio: '0%'
      },
      flowCard: {
        count: 0,
        ratio: '0%'
      },
      checkCard: {
        normal_count: 0,
        abnormal_count: 0
      },
      chartData1: {
        columns: ['日期', '失败数', '成功数'],
        rows: []
      },
      chartData2: {
        columns: ['日期', '失败数', '成功数'],
        rows: []
      },
      chartData3: {
        columns: ['IP', '异常次数'],
        rows: []
      },
      chartData4: {
        columns: ['name', 'num'],
        rows: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > +new Date(default_end_time)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.init()
  },
  watch: {
    datetimerange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  beforeDestory() {
    this.stopInterval()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        getJobCardDataApi(this.form),
        getFlowCardDataApi(this.form),
        getFlowChartDataApi(this.form),
        getJobChartDataApi(this.form),
        getHostChartDataApi(this.form)
      ])
        .then(res => {
          this.jobCard = res[0]
          this.chartData4.rows = this.handleChartData2(res[0].top5)
          this.flowCard = res[1]
          this.chartData2.rows = this.handleChartData1(res[2])
          this.chartData1.rows = this.handleChartData1(res[3])
          this.chartData3.rows = this.handleChartData3(res[4])
          this.checkCard = {
            normal_count: res[4].normal_count,
            abnormal_count: res[4].abnormal_count
          }
        }).finally(() => {
          this.loading = false
        })
    },
    handleTimeChange() {
      this.init()
    },
    handleChange(val) {
      if (val) {
        this.startInterval()
      } else {
        this.stopInterval()
      }
    },
    startInterval() {
      this.interval = setInterval(() => {
        Promise.all([
          getJobCardDataApi(this.form),
          getFlowCardDataApi(this.form),
          getFlowChartDataApi(this.form),
          getJobChartDataApi(this.form),
          getHostChartDataApi(this.form)
        ])
          .then(res => {
            this.jobCard = res[0]
            this.chartData4.rows = this.handleChartData2(res[0].top5)
            this.flowCard = res[1]
            this.chartData2.rows = this.handleChartData1(res[2])
            this.chartData1.rows = this.handleChartData1(res[3])
            this.chartData3.rows = this.handleChartData3(res[4])
            this.checkCard = {
              normal_count: res[4].normal_count,
              abnormal_count: res[4].abnormal_count
            }
          }).catch(() => {
            clearInterval(this.interval)
          })
      }, 10000)
    },
    stopInterval() {
      clearInterval(this.interval)
    },
    /**
     * 接口数据处理
     */
    handleChartData1(data) {
      const result = []
      data.forEach((item) => {
        result.push({
          '日期': item.date,
          '失败数': item.failed,
          '成功数': item.success
        })
      })
      return result
    },
    handleChartData2(data) {
      const result = []
      data.forEach((item) => {
        result.push({
          'name': item.name,
          'num': item.count
        })
      })
      return result
    },
    handleChartData3(data) {
      const result = []
      data.forEach((item) => {
        result.push({
          'IP': item.target_ip,
          '异常次数': item.count
        })
      })
      return result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  & /deep/ .page-bar {
    background-color: transparent;
  }
}
.dash-body{
  padding: 25px 25px;
  .dash-header{
    .dash-title{
      font-size: 31px;
    }
    .dash-desc{
      padding-top: 10px;
    }
  }
  .header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dash-card{
    margin-top: 40px;
    .card-panel{
      position: relative;
      width: 31%;
      height: 190px;
      display: inline-block;
      margin-left: 20px;
      vertical-align: top;
      padding: 20px;
      color:#fff;
      .card-fcount{
        padding-top: 75px;
        .ft-sz{
          font-size: 38px;
        }
        span{
          display: inline-block;
          vertical-align: bottom;
          margin-right: 20px;
        }
      }
    }
    .card-panel:first-child{
      margin-left: 0px;
    }
    .panel-bg-01{
      /* Mask: */
      background-image: linear-gradient(-45deg, #0C3483 0%, #6B8CCE 100%);
      box-shadow: 0 4px 10px 0 rgba(153,169,191,0.50);
      border-radius: 10.68px;
    }
    .panel-bg-02{
      background-image: linear-gradient(132deg, #00C6FB 0%, #005BEA 100%);
      box-shadow: 0 4px 10px 0 rgba(153,169,191,0.50);
      border-radius: 10.68px;
    }
    .panel-bg-03{
      /* Mask: */
      background-image: linear-gradient(-45deg, #764BA2 0%, #667EEA 100%);
      box-shadow: 0 4px 10px 0 rgba(153,169,191,0.50);
      border-radius: 10.68px;
    }
  }
  .width-20 {
    width: 20px;
    height: 1px;
  }
  .line-chart {
    margin-top: 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-line {
      flex: 1;
      background: #FFFFFF;
      box-shadow: 0 4px 9px 0 rgba(0,0,0,0.02);
      border-radius: 5px;
    }
  }
  .top-chart {
    margin-top: 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-top {
      background: #FFFFFF;
      box-shadow: 0 4px 9px 0 rgba(0,0,0,0.02);
      border-radius: 5px;
    }
    .top10-container {
      flex: 1;
    }
    .top5-container {
      width: 368px;
    }
  }
}
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .7);
  color: #888;
  font-size: 14px;
}
</style>
