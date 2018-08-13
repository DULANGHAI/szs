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
        <el-tab-pane label="文件列表" name="first">
          <div class="tabs-contents">
            <file-list></file-list>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分发记录" name="second">
          <div class="tabs-contents">
            <record-list></record-list>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import FileList from './FileList'
import RecordList from './RecordList'

export default {
  components: {
    Breadcrumb,
    FileList,
    RecordList
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

<style lang="scss" scoped>
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
