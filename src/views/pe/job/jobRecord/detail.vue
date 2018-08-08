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
        <el-tab-pane label="执行路径" name="first">
          <div class="tabs-contents">
            <record-path ref="recordPath"></record-path>
          </div>
        </el-tab-pane>
        <el-tab-pane label="日志" name="second">
          <div class="tabs-contents">
            <!-- <record-log ref="recordLog" v-if="activeName === 'second'"></record-log> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RecordPath from './components/path'
import RecordLog from './components/log'

import { getDetailApi, getLogDetailApi } from '@/api/pe/jobManage/jobRecord'

export default {
  props: ['id'],
  components: {
    Breadcrumb,
    RecordPath,
    RecordLog
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  watch: {
  },
  async created() {
    const pathData = await this.getPathData()
    // const logData = await this.getLogData(pathData.execution_id, pathData.target_ip)

    this.$refs.recordPath.setData(pathData)
    // this.$refs.recordLog.setData(pathData, logData)
  },
  methods: {
    getPathData() {
      return getDetailApi(this.id).then(res => {
        return res.items[0]
      })
    },
    getLogData(execution_id, target_ip) {
      return getLogDetailApi(execution_id, target_ip).then(res => {
        return res.execution_log
      })
    }
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
