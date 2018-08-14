<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="dash-body">
      <div class="dash-header">
        <div class="dash-title">运维作业仪表盘</div>
        <div class="dash-desc">早上好，张居正，欢迎来到上证信息运维自动化平台</div>
      </div>
      <div class="dash-card">
        <div class="card-panel panel-bg-01">
          <div><svg-icon icon-class="icon-ziyuan" style="margin-right:10px;"/>作业</div>
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
          <div><svg-icon icon-class="icon-banbenku" style="margin-right:10px;"/>流程</div>
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
          <div><svg-icon icon-class="icon-heimingdan" style="margin-right:10px;"/>日常检查</div>
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
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      multipleSelection: [],
      listLoading: false,
      form: JSON.parse(JSON.stringify(formData)),
      listData: []
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
