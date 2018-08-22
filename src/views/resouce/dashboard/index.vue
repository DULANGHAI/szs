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
          <div><svg-icon icon-class="icon-ziyuan" style="margin-right:10px;"/>资源数</div>
          <div class="card-fcount">
            <span>
              <div>主机数</div>
              <div class="ft-sz">2344</div>
            </span>
            <span>
              <div>应用实例数</div>
              <div class="ft-sz">122</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-02">
          <div><svg-icon icon-class="icon-banbenku" style="margin-right:10px;"/>版本库</div>
          <div class="card-fcount">
            <span>
              <div>脚本文件库</div>
              <div class="ft-sz">2344</div>
            </span>
            <span>
              <div>软件包库</div>
              <div class="ft-sz">122</div>
            </span>
            <span>
              <div>配置文件库</div>
              <div class="ft-sz">122</div>
            </span>
          </div>
        </div>
        <div class="card-panel panel-bg-03">
          <div><svg-icon icon-class="icon-heimingdan" style="margin-right:10px;"/>黑白名单</div>
          <div class="card-fcount">
            <span>
              <div>白名单数</div>
              <div class="ft-sz">2344</div>
            </span>
            <span>
              <div>风险命令数</div>
              <div class="ft-sz">122</div>
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
            :extend="extend1"></ve-line>
        </div>
        <div class="width-20"></div>
        <!-- 流程执行统计 -->
        <div class="v-line">
          <ve-histogram
            :data="chartData2"
            :settings="chartSettings2"
            :extend="extend2"></ve-histogram>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters } from 'vuex'
import echarts from 'echarts'

const formData = {
  'datatime': []
}
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
      grid: {
        show: false,
        bottom: 20,
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
    this.chartSettings1 = {
      // color:
    }
    this.extend2 = {
      title: {
        text: 'TOP10主机作业执行次数'
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
            rotate: 45
          },
          barWidth: 20
        }
      ]
    }
    this.chartSettings2 = {
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
    return {
      multipleSelection: [],
      datetimerange: '',
      timed: false,
      listLoading: false,
      form: JSON.parse(JSON.stringify(formData)),
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(123)
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
}
</style>
