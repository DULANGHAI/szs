<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="dash-body">
      <div class="dash-header">
        <div class="dash-title">资源管理面板</div>
        <div class="dash-desc">早上好，张居正，欢迎来到上证信息运维自动化平台</div>
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
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { Message } from 'element-ui'

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
