<template>
  <div class="dashboard">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="dash-body">
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
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="定时刷新">
              <el-switch v-model="timed"></el-switch>
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
              <div class="ft-sz">124</div>
            </span>
            <span>
              <div>成功率</div>
              <div class="ft-sz">89%</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-02">
          <div><svg-icon icon-class="da-flow" style="margin-right:10px;"/>流程</div>
          <div class="card-fcount">
            <span>
              <div>流程执行数</div>
              <div class="ft-sz">263</div>
            </span>
            <span>
              <div>成功率</div>
              <div class="ft-sz">34%</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-03">
          <div><svg-icon icon-class="da-check" style="margin-right:10px;"/>日常检查</div>
          <div class="card-fcount">
            <span>
              <div>正常主机数</div>
              <div class="ft-sz">112</div>
            </span>
            <span>
              <div>异常主机数</div>
              <div class="ft-sz">9109</div>
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
            :extend="extend1"></ve-line>
        </div>
        <div class="width-20"></div>
        <!-- 流程执行统计 -->
        <div class="v-line">
          <ve-line
            :data="chartData2"
            :colors="colors"
            :extend="extend2"></ve-line>
        </div>
      </div>

      <!-- top -->
      <div class="top-chart">
        <!-- top10异常主机 -->
        <div class="v-top top10-container">
          <ve-histogram
            :data="chartData3"
            :settings="chartSettings3"
            :extend="extend3"></ve-histogram>
        </div>
        <div class="width-20"></div>
        <!-- top5作业 -->
        <div class="v-top top5-container">
          <ve-ring
            :data="chartData4"
            :settings="chartSettings4"
            :extend="extend4"></ve-ring>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters } from 'vuex'
import echarts from 'echarts'

export default {
  components: {
    Breadcrumb
  },
  data() {
    this.colors = ['#874DA2', '#09BBFF']
    this.extend1 = {
      title: {
        text: '作业量统计'
      },
      grid: {
        // bottom: 0,
        containLabel: true
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
      grid: {
        // bottom: 0,
        containLabel: true
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
      grid: {
        bottom: 20,
        containLabel: true
      },
      legend: {
        show: false
      },
      series: [
        {
          type: 'bar',
          label: {
            show: false,
            rotate: 45
          },
          barWidth: 20
        }
      ]
    }
    this.chartSettings3 = {
      label: {
        rotate: 45
      },
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
      grid: {
        bottom: 20,
        containLabel: true
      },
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
      multipleSelection: [],
      listLoading: false,
      form: {
        start_time: '',
        end_time: ''

      },
      datetimerange: '',
      timed: false,
      listData: [],
      chartData1: {
        columns: ['日期', '失败数', '成功数'],
        rows: [
          { '日期': '05/09', '失败数': 1393, '成功数': 1093 },
          { '日期': '05/10', '失败数': 3530, '成功数': 3230 },
          { '日期': '05/11', '失败数': 2923, '成功数': 2623 },
          { '日期': '05/12', '失败数': 1723, '成功数': 1423 },
          { '日期': '05/13', '失败数': 3792, '成功数': 3492 },
          { '日期': '05/14', '失败数': 4593, '成功数': 4293 }
        ]
      },
      chartData2: {
        columns: ['日期', '失败数', '成功数'],
        rows: [
          { '日期': '05/09', '失败数': 1393, '成功数': 1093 },
          { '日期': '05/10', '失败数': 3530, '成功数': 3230 },
          { '日期': '05/11', '失败数': 2923, '成功数': 2623 },
          { '日期': '05/12', '失败数': 1723, '成功数': 1423 },
          { '日期': '05/13', '失败数': 3792, '成功数': 3492 },
          { '日期': '05/14', '失败数': 4593, '成功数': 4293 }
        ]
      },
      chartData3: {
        columns: ['IP', '异常次数'],
        rows: [
          { 'IP': '205.205.205.201', '异常次数': 1393 },
          { 'IP': '205.205.205.202', '异常次数': 3530 },
          { 'IP': '205.205.205.203', '异常次数': 2923 },
          { 'IP': '205.205.205.204', '异常次数': 1723 },
          { 'IP': '205.205.205.205', '异常次数': 3792 },
          { 'IP': '205.205.205.206', '异常次数': 4593 },
          { 'IP': '205.205.205.207', '异常次数': 3530 },
          { 'IP': '205.205.205.208', '异常次数': 2923 },
          { 'IP': '205.205.205.209', '异常次数': 1723 },
          { 'IP': '205.205.205.210', '异常次数': 3792 }
        ]
      },
      chartData4: {
        columns: ['name', 'num'],
        rows: [
          { 'name': '安装Tomcat', 'num': 1393 },
          { 'name': '重启Nfs', 'num': 3530 },
          { 'name': '安装核心系统', 'num': 2923 },
          { 'name': '重启Nginx', 'num': 1723 },
          { 'name': '修改Tomcat配置', 'num': 3792 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  watch: {
    datetimerange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  methods: {
    getList() {

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
    height: 366px;
  }
  .line-chart {
    margin-top: 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-line {
      flex: 1;
      height: 366px;
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
      height: 465px;
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
</style>
