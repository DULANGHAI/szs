<template>
  <div class="container">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <el-tabs v-model="activeName">
        <el-tab-pane label="tab1" name="first">
          <div class="tabs-contents">
            <list-view-one></list-view-one>
          </div>
        </el-tab-pane>
        <el-tab-pane label="tab2" name="second">
          <div class="tabs-contents">
            <list-view-two></list-view-two>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import ListViewOne from './ListViewOne'
import ListViewTwo from './ListViewTwo'

export default {
  components: {
    Breadcrumb,
    ListViewOne,
    ListViewTwo
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  & /deep/ .container-body .el-tabs__nav-scroll {
    padding: 0px 24px;
    background: #fff;
  }
  & /deep/ .choose-container .el-tabs__nav-scroll {
    padding: 0;
    background: inherit;
  }
  & /deep/ .container-body .el-tabs__content {
    margin: 0px 24px;
    background: #fff;
    min-height: 100%;
  }
  & /deep/ .tabs-contents {
    padding: 29px 32px;
  }
}
</style>
