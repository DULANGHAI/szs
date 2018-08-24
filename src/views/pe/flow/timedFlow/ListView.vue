<template>
  <div class="container">
    <div class="container-content">
      <!-- 左侧筛选列表 -->
      <div class="left">
        <!-- 筛选 -->
        <div class="job-filter">
          <el-input placeholder="可搜索流程名"
            suffix-icon="el-icon-search"
            v-model="form1.name">
          </el-input>
        </div>
        <!-- 列表 -->
        <div class="job-list">
          <div v-for="(item, index) in dataFlow" :key="index">
            <flow-item :uniqueId="uniqueId" :data="item" :selected="selectedFlow" :selectNode="selectNode"></flow-item>
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
            <div class="op-item" @click="doFlow" :class="{disable: multipleSelection.length !== 1}">
              <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">执行</div>
            </div>
          </div>
          <div class="flex">
            <div class="op-item" @click="handleMultipleDelete" :class="{disable: multipleSelection.length === 0}">
              <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">删除</div>
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="table" v-loading="loading">
          <tree-table :data.sync="data" :expandAll="false" :multipleSelection.sync="multipleSelection">
            <!-- <el-table-column prop="name" label="名称" width="130px" :show-overflow-tooltip="true"></el-table-column> -->
            <el-table-column prop="job_type" label="类型" :formatter="formatterType"></el-table-column>
            <el-table-column prop="created_at" label="提交时间" width="160px" :formatter="formatterTime"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row._level === 1">
                  <el-button type="text" size="small" @click="handleTimedSet(scope.row)">编辑定时流程</el-button>
                </div>
                <div v-if="scope.row.job_type === 'manual'">
                  <el-button type="text" size="small" @click="handleManualSet(scope.row)">编辑人工流程</el-button>
                </div>
                <div v-if="scope.row._level === 2 && scope.row.job_type !== 'manual'">
                  <el-button type="text" size="small" @click="handleJobSet(scope.row)">作业配置</el-button>
                  <el-button type="text" size="small" @click="handleTaskSet(scope.row)">任务配置</el-button>
                </div>
              </template>
            </el-table-column>
          </tree-table>

          <!-- 分页 -->
          <div class="pagination" v-if="total">
            <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
          </div>
        </div>

      </div>

    </div>

    <!-- 添加/编辑 人工流程 -->
    <add-manual ref="addManual" :data.sync="needSetJob" :refresh="refresh"></add-manual>
    <!-- 编辑作业 -->
    <job-config ref="jobConfig" :data.sync="needSetJob" :refresh="refresh"></job-config>
    <!-- 任务配置 -->
    <task-config ref="taskConfig" :data.sync="needSetJob" :refresh="refresh"></task-config>
    <!-- 添加/编辑 定时流程model -->
    <add-timed ref="addModel" :type="addType" :data1="selectedFlow" :data2="needSetJob" :refresh="refreshList"></add-timed>

  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import FlowItem from '../instantFlow/components/FlowItem'
import TreeTable from '../instantFlow/components/TreeTable'
import AddManual from '../flowList/components/AddManual'
import TaskConfig from '../flowList/components/TaskConfig'
import JobConfig from '../flowList/components/JobConfig'
import AddTimed from './components/AddTimed'

import { getFlowListApi, getTimedListApi, deleteTimedApi, doFlowApi } from '@/api/pe/flowManage/timedFlow'

export default {
  components: {
    InfiniteLoading,
    FlowItem,
    TreeTable,
    AddManual,
    TaskConfig,
    JobConfig,
    AddTimed
  },
  data() {
    return {
      form1: { // 左侧的流程筛选列表
        name: '',
        page: 1,
        per_page: 10
      },
      dataFlow: [],
      selectedFlow: {},
      loading: false,
      form2: { // 右边的定时作业列表
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      multipleSelection: [],
      uniqueId: +new Date(),
      needSetJob: null, // 需要配置的作业信息
      addType: 'add'
    }
  },
  watch: {
    'form1.name'(val, oldVal) {
      this.form1.page = 1
      this.dataFlow = []
      this.selectedFlow = {}
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    }
  },
  created() {
    this.loading = true
    Promise.all([getTimedListApi(this.form2)])
      .then(res => {
        const data = this.handleData(res[0].items)
        this.data = data
        this.total = res[0].total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
  },
  methods: {
    loadMore($state) {
      getFlowListApi(this.form1).then(res => {
        if (res.items.length === 0) {
          $state.loaded()
          $state.complete()
          this.$refs.infiniteLoading.isComplete = true
        } else {
          this.dataFlow = this.dataFlow.concat(res.items)
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
    handleData(data) {
      const result = []

      data.forEach((item) => {
        const temp = JSON.parse(item.scheduling)
        item.scheduling = temp
        result.push(item)
      })

      return result
    },
    selectNode(obj) {
      this.selectedFlow = obj
      this.uniqueId = +new Date()
    },
    createInstant() {
      if (!this.selectedFlow.id) {
        this.$message({
          showClose: true,
          message: '请先选中一条流程',
          type: 'error'
        })
      } else {
        this.addType = 'add'
        this.$refs.addModel.showMoel()
      }
    },
    deepClone(obj) {
      const objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deepClone(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
    },
    formatterType(row) {
      if (row._level === 1) {
        return '流程'
      } else if (row.job_type === 'manual') {
        return '人工流程'
      } else {
        return '作业'
      }
    },
    formatterTime(row) {
      if (row.created_at) {
        return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 定时流程配置
    handleTimedSet(row) {
      this.addType = 'edit'
      this.needSetJob = row
      this.$refs.addModel.showMoel()
    },
    // 人工流程配置
    handleManualSet(row) {
      this.needSetJob = row
      this.$refs.addManual.showMoel()
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
    },
    refresh() {
      this.data = this.data.concat([])
    },
    refreshList() {
      this.getListData(1)
    },
    getListData(index) {
      this.loading = true
      const params = this.form2
      if (index) {
        params.page = index
      }
      getTimedListApi(params).then(res => {
        const data = this.handleData(res.items)
        this.data = data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handlePageChange(val) {
      this.form2.page = val
      this.getListData()
    },
    getFlowIds() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    handleMultipleDelete() {
      this.$confirm('确认要删除这些流程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = this.getFlowIds()
        this.deleteTasks({
          process_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteTasks(data) {
      deleteTimedApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    doFlow() {
      const data = this.multipleSelection[0]
      // 处理数据，把里面的_expended _level _show parent 属性删除,得到一份新的数据拷贝
      const newData = this.deleteAttr(data.scheduling)
      data.scheduling = JSON.stringify(newData)

      doFlowApi({
        process_info: JSON.stringify(data)
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    deleteAttr(obj) {
      const objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && key !== '_expended' && key !== '_level' && key !== '_show' && key !== 'parent') {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deleteAttr(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
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
    padding: 0 13px;
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
