<template>
  <div class="dashboard">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="dash-body" v-loading="loading">
      <div class="dash-header">
        <div class="dash-title">资源管理仪表盘</div>
        <div class="header-flex">
          <div class="dash-desc">{{`早上好，${name}，欢迎来到上证信息运维自动化平台`}}</div>
          <el-form :inline="true">
            <el-form-item label="时间">
              <el-date-picker
                size="small"
                v-model="datetimerange"
                type="daterange"
                value-format="yyyy-MM-dd"
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
          <div><svg-icon icon-class="icon-ziyuan" style="margin-right:10px;"/>资源数</div>
          <div class="card-fcount">
            <span>
              <div>主机数</div>
              <div class="ft-sz">{{hostNum}}</div>
            </span>
            <span>
              <div>应用实例数</div>
              <div class="ft-sz">{{applicationNum}}</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-02">
          <div><svg-icon icon-class="icon-banbenku" style="margin-right:10px;"/>版本库</div>
          <div class="card-fcount">
            <span>
              <div>脚本文件库</div>
              <div class="ft-sz">{{repositories.scripts_count}}</div>
            </span>
            <span>
              <div>软件包库</div>
              <div class="ft-sz">{{repositories.applications_count}}</div>
            </span>
            <span>
              <div>配置文件库</div>
              <div class="ft-sz">{{repositories.configurations_count}}</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-03">
          <div><svg-icon icon-class="icon-heimingdan" style="margin-right:10px;"/>黑白名单</div>
          <div class="card-fcount">
            <span>
              <div>白名单数</div>
              <div class="ft-sz">{{white_black.commands_count}}</div>
            </span>
            <span>
              <div>风险命令数</div>
              <div class="ft-sz">{{white_black.risks_count}}</div>
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
            :extend="extend1">
            <div v-show="!chartData1.rows.length" class="data-empty">暂无数据</div>
            </ve-line>
        </div>
        <div class="width-20"></div>
        <!-- 流程执行统计 -->
        <div class="v-line">
          <ve-histogram
            :data="chartData2"
            :settings="chartSettings2"
            :extend="extend2">
            <div v-show="!chartData2.rows.length" class="data-empty">暂无数据</div>
            </ve-histogram>
        </div>
      </div>

      <!-- top -->
      <div class="top-chart">
        <!-- 作业队列 -->
        <div class="v-top top10-container">
          <div class="table-title">作业队列监控</div>
          <div class="table">
            <el-table :data="chartData3" height="372" style="width: 100%">
              <el-table-column prop="name" label="worker"></el-table-column>
              <el-table-column prop="scheduled" label="计划任务数"></el-table-column>
              <el-table-column prop="reserved" label="堆积量"></el-table-column>
              <el-table-column prop="finished" label="完成数"></el-table-column>
              <el-table-column prop="active" label="活跃数"></el-table-column>
              <el-table-column prop="memory_usage" label="内存使用量"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="width-20"></div>
        <!-- top5作业 -->
        <div class="v-top top5-container">
          <ve-histogram
            :data="chartData4"
            :extend="extend4">
            <div v-show="!chartData4.rows.length" class="data-empty">暂无数据</div>
            </ve-histogram>
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

import { getHostsDataApi, getApplicationDataApi, getWorkersDataApi, getHealthDataApi, getFileChartDataApi, getRepositoriesDataApi, getWhiteBlackDataApi, getJobChartDataApi } from '@/api/resouce/dashboard/index'

const default_start_time = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
const default_end_time = dayjs().format('YYYY-MM-DD')

export default {
  components: {
    Breadcrumb,
    echarts
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    this.extend1 = {
      title: {
        text: '文件提交统计'
      },
      color: ['#874DA2', '#09BBFF', '#868F96'],
      grid: {
        show: false,
        bottom: 20,
        containLabel: true
      },
      legend: {
        data: [
          {
            name: '脚本库',
            icon: 'circle'
          },
          {
            name: '软件包库',
            icon: 'circle'
          },
          {
            name: '配置文件库',
            icon: 'circle'
          }
        ]
      }
    }
    this.extend2 = {
      title: {
        text: 'TOP10主机作业执行次数'
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
    this.chartSettings2 = {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#2A89FF' },
          { offset: 1, color: '#09BBFF' }
        ])
      }
    }
    this.extend4 = {
      title: {
        text: '执行节点监控'
      },
      color: ['#00C6FB'],
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
      },
      yAXIS: {
        minInterval: 1
      }
    }
    return {
      loading: false,
      datetimerange: [default_start_time, default_end_time],
      form: {
        start_time: default_start_time,
        end_time: default_end_time
      },
      timed: false,
      hostNum: 0,
      applicationNum: 0,
      repositories: {
        'scripts_count': 0,
        'configurations_count': 0,
        'applications_count': 0
      },
      white_black: {
        'commands_count': 0,
        'risks_count': 0
      },
      chartData1: {
        columns: ['日期', '脚本库', '软件包库', '配置文件库'],
        rows: []
      },
      chartData2: {
        columns: ['IP', '执行次数'],
        rows: []
      },
      chartData3: [],
      chartData4: {
        columns: ['group', '执行节点数'],
        rows: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > +new Date(default_end_time)
        }
      },
      interval: ''
    }
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
        getWorkersDataApi(),
        getHealthDataApi(),
        getHostsDataApi(this.form),
        getApplicationDataApi(this.form),
        getFileChartDataApi(this.form),
        getRepositoriesDataApi(this.form),
        getWhiteBlackDataApi(this.form),
        getJobChartDataApi(this.form)
      ])
        .then(res => {
          this.chartData3 = res[0]
          this.chartData4.rows = this.handleData4(res[1])
          this.hostNum = res[2].count
          this.applicationNum = res[3].count
          this.chartData1.rows = this.handleData1(res[4])
          this.repositories = res[5]
          this.white_black = res[6]
          this.chartData2.rows = this.handleData2(res[7])
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
          getHostsDataApi(this.form),
          getApplicationDataApi(this.form),
          getFileChartDataApi(this.form),
          getRepositoriesDataApi(this.form),
          getWhiteBlackDataApi(this.form),
          getJobChartDataApi(this.form)
        ])
          .then(res => {
            this.hostNum = res[0].count
            this.applicationNum = res[1].count
            this.chartData1.rows = this.handleData1(res[2])
            this.repositories = res[3]
            this.white_black = res[4]
            this.chartData2.rows = this.handleData2(res[5])
          })
          // .catch(() => {
          //   clearInterval(this.interval)
          // })
      }, 10000)
    },
    stopInterval() {
      clearInterval(this.interval)
    },
    /**
     * 数据处理函数
     */
    handleData1(data) {
      const result = []
      data && data.forEach((item) => {
        result.push({
          '日期': item.date,
          '脚本库': item.scripts_count,
          '软件包库': item.applications_count,
          '配置文件库': item.configurations_count
        })
      })
      return result
    },
    handleData2(data) {
      const result = []
      data && data.forEach((item) => {
        result.push({
          'IP': item.target_ip,
          '执行次数': item.count
        })
      })
      return result
    },
    handleData4(data) {
      const result = []
      data && data.forEach((item) => {
        result.push({
          'group': item.cluster_name,
          '执行节点数': item.workers_number
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
    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      padding: 20px;
    }
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
      background-image: linear-gradient(0deg, #0BA360 0%, #3CBA92 100%);
      box-shadow: 0 2px 4px 0 rgba(153,169,191,0.50);
      border-radius: 10.68px;
    }
    .panel-bg-02{
      background-image: linear-gradient(45deg, #0C3483 0%, #6B8CCE 100%);
      box-shadow: 0 4px 10px 0 rgba(153,169,191,0.50);
      border-radius: 10.68px;
    }
    .panel-bg-03{
      /* Mask: */
      background-image: linear-gradient(-225deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%);
      border-radius: 10.68px;
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
      height: 400px;
    }
    .table-title {
      color: #333;
      font-size: 18px;
      line-height: 1.6;
      font-weight: bold;
      padding-left: 10px;
    }
    .table {
      width: 100%;
      height: calc(100% - 28px);
      overflow-y: auto;
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
