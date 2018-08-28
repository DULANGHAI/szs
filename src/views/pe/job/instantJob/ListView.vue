<template>
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
            <job-item :uniqueId="uniqueId" :data="item" :selected="selectedJob" :selectNode="selectNode"></job-item>
          </div>
          <infinite-loading ref="infiniteLoading" @infinite="loadMore" spinner="spiral">
            <span slot="no-more">
              没有更多数据了
            </span>
          </infinite-loading>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right">
        <!-- 操作列表 -->
        <div class="tool-box">
          <div class="flex">
            <div class="op-item" @click="createInstant">
              <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">创建</div>
            </div>
            <div class="op-item" @click="doTask" :class="{disable: multipleSelection.length !== 1}">
              <svg-icon icon-class="zhixing" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">执行</div>
            </div>
            <div class="op-item" @click="refresh">
              <svg-icon icon-class="refresh_instant" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">刷新</div>
            </div>
          </div>
          <div class="flex">
            <div class="op-item" @click="handleMultipleDelete">
              <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">删除</div>
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="table">
          <el-table
            ref="table"
            v-loading="loading"
            :data="dataInstant"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="creator" label="执行人"></el-table-column>
            <el-table-column prop="job_type" label="类型" :formatter="formatterJobType"></el-table-column>
            <el-table-column prop="created_at" label="提交时间" width="160px" :formatter="formatterTime"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleJobSet(scope.row)">作业配置</el-button>
                <el-button type="text" size="small" @click="handleTaskSet(scope.row)">任务配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination" v-if="total">
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
        </div>
      </div>

      <!-- 编辑作业 -->
      <job-config ref="jobConfig" :data="needSetJob" :refresh="getListData"></job-config>
      <!-- 任务配置 -->
      <task-config ref="taskConfig" :data="needSetJob" :refresh="getListData"></task-config>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import JobItem from './components/JobItem'
import TaskConfig from './components/TaskConfig'
import JobConfig from './components/JobConfig'

import { getLanguageApi, getJobListApi, getInstantListApi, doTaskApi, createInstantApi, deleteInstantApi } from '@/api/pe/jobManage/instantJob'

export default {
  components: {
    InfiniteLoading,
    JobItem,
    TaskConfig,
    JobConfig
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {
      loading: false,
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
      dataJob: [],
      selectedJob: {},
      form2: { // 右边的即时作业列表
        page: 1,
        per_page: 10
      },
      total: 0,
      system_type_arr: [],
      dataInstant: [],
      multipleSelection: [],
      uniqueId: +new Date(),
      needSetJob: null // 需要配置的作业信息
    }
  },
  watch: {
    'form1.name'(val, oldVal) {
      this.form1.page = 1
      this.dataJob = []
      this.selectedJob = {}
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    }
  },
  created() {
    this.loading = true
    Promise.all([getLanguageApi(), getInstantListApi(this.form2)])
      .then(res => {
        this.system_type_arr = this.handleSystemData(res[0])
        this.dataInstant = res[1].items
        this.total = res[1].total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {

      })
    }, 20)
  },
  methods: {
    formatterTime(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
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
        this.form1.page = 1
        this.dataJob = []
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
    },
    getListData(index) {
      this.loading = true
      const params = this.form2
      if (index) {
        params.page = index
      }
      getInstantListApi(params).then(res => {
        this.dataInstant = res.items
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    loadMore($state) {
      getJobListApi(this.form1).then(res => {
        if (res.items.length === 0) {
          $state.loaded()
          $state.complete()
          this.$refs.infiniteLoading.isComplete = true
        } else {
          this.dataJob = this.dataJob.concat(res.items)
          $state.loaded()
          if (res.pages > res.page) {
            this.form1.page++
            this.$refs.infiniteLoading.isLoading = false
          } else {
            $state.complete()
            this.$refs.infiniteLoading.isComplete = true
          }
        }
      }).catch(() => {
        $state.loaded()
        $state.complete()
        this.$refs.infiniteLoading.isComplete = true
      })
    },
    selectNode(obj) {
      this.selectedJob = obj
      this.uniqueId = +new Date()
    },
    handlePageChange(val) {
      this.form2.page = val
      this.getListData()
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    createInstant() {
      if (!this.selectedJob.id) {
        this.$message({
          showClose: true,
          message: '请先选中一条作业',
          type: 'error'
        })
      } else {
        createInstantApi({ job_id: this.selectedJob.id }).then(res => {
          this.getListData(1)
        })
      }
    },
    doTask() {
      const data = this.multipleSelection[0]
      data.scheduling = JSON.stringify(JSON.parse(data.scheduling))
      doTaskApi({
        job_info: JSON.stringify(data)
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.refresh()
      })
    },
    refresh() {
      this.getListData(1)
    },
    getJobIds() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    handleMultipleDelete() {
      this.$confirm('确认要删除这些作业吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = this.getJobIds()
        this.deleteTasks({
          job_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteTasks(data) {
      deleteInstantApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    // 作业配置
    handleJobSet(row) {
      this.needSetJob = row
      this.$refs.jobConfig.showMoel()
    },
    // 任务配置
    handleTaskSet(row) {
      this.needSetJob = row
      this.$refs.taskConfig.showMoel()
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  // margin: 24px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.container-content {
  overflow: hidden;
}
.left {
  float: left;
  width: 300px;
  padding: 29px 0 0;
  border-right: 1px solid #E8E8E8;
  .job-filter {
    display: flex;
    align-items: center;
    padding-left: 13px;
  }
  .job-list {
    margin-top: 10px;
    overflow-y: auto;
    height: 600px;
  }
}
.right {
  overflow: hidden;
  margin-left: 300px;
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
