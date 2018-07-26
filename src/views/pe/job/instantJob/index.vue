<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <div class="container-content">
        <!-- 左侧筛选列表 -->
        <div class="left">
          <!-- 筛选 -->
          <div class="job-filter">
            <el-input placeholder="可搜索作业名"
              suffix-icon="el-icon-search"
              v-model="form1.name">
            </el-input>
            <el-dropdown>
              <span class="el-dropdown-link">
                <svg-icon :icon-class="form1.system_type ? 'filter_active' : 'filter'" :style="{ margin: '0 10px' }"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in system_type_arr"
                  :key="index"
                  @click.native="systemClick(item)">
                  <span :class="{'active-blue': form1.system_type === item.value}">{{item.label}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 列表 -->
          <div class="job-list">
            <div v-for="(item, index) in dataJob" :key="index">
              <job-item :data="item"></job-item>
            </div>
          </div>
        </div>
        <!-- 右侧内容 -->
        <div class="right">
          <!-- 操作列表 -->
          <div class="tool-box">
            <div class="flex">
              <div class="op-item">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
              <div class="op-item" @click="doTask">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">执行</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">停止</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="refresh_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">刷新</div>
              </div>
            </div>
            <div class="flex">
              <div class="op-item">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">任务编辑</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="refresh_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">作业编辑</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <div class="table">
            <el-table
              ref="table"
              :data="dataInstant"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="execution_id" label="执行ID" width="100px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="creator" label="执行人"></el-table-column>
              <el-table-column prop="job_type" label="类型" :formatter="formatterJobType"></el-table-column>
              <el-table-column prop="status" label="状态"></el-table-column>
              <el-table-column prop="result" label="结果"></el-table-column>
              <el-table-column prop="created_at" label="提交时间"></el-table-column>
              <el-table-column prop="start_time" label="开始时间"></el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="pagination" v-if="total">
            <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import JobItem from './components/JobItem'

import { getLanguageApi, getJobListApi, getInstantListApi, doTaskApi } from '@/api/pe/jobManage/instantJob'

export default {
  components: {
    Breadcrumb,
    RiskLevel,
    JobItem
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {
      form1: { // 左侧的作业筛选列表
        name: '',
        system_type: '',
        type: '',
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      form2: { // 右边的即时作业列表
        page: 1,
        per_page: 10
      },
      total: 0,
      system_type_arr: [],
      dataJob: [],
      dataInstant: [],
      multipleSelection: []
    }
  },
  created() {
    Promise.all([getLanguageApi(), getJobListApi(this.form1), getInstantListApi(this.form2)])
      .then(res => {
        this.system_type_arr = this.handleSystemData(res[0])
        this.dataJob = res[1].items
        this.dataInstant = res[2].items
      })
  },
  methods: {
    handleSystemData(data) {
      const result = [{ label: '全部', value: '' }]
      Object.keys(data).forEach((item) => {
        result.push({ label: item, value: item })
      })
      return result
    },
    systemClick(item) {
      if (this.form1.system_type !== item.value) {
        this.form1.system_type = item.value
        this.getListData(1)
      }
    },
    getListData(index) {
      const params = this.form1
      if (index) {
        params.page = index
      }
      getJobListApi(params).then(res => {
        this.dataJob = res.items
      })
    },
    handlePageChange(val) {
      this.form.page = val
      this.getListData()
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    doTask() {
      doTaskApi({
        job_info: JSON.stringify(this.multipleSelection[0])
      }).then(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.container-content {
  display: flex;
}
.left {
  width: 300px;
  padding: 29px 0;
  min-height: 700px;
  border-right: 1px solid #E8E8E8;
  .job-filter {
    display: flex;
    align-items: center;
    padding-left: 13px;
  }
  .job-list {
    margin-top: 10px;
    overflow-y: auto;
  }
}
.right {
  flex: 1;
  padding: 29px 0;
  .tool-box {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
  }
  .op-item {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: rgba(0,0,0,0.85);
    &.disable {
      opacity: 0.65;
      pointer-events: none;
    }
  }
}
.flex {
  display: flex;
}
.mart-10 {
  margin-top: 10px;
}
.table {
  margin-top: 18px;
  & /deep/ .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
