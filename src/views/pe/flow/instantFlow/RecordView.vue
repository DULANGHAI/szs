<template>
  <div class="container">
    <!-- 筛选 -->
    <div class="toolbar">
      <el-form :model="form" :inline="true" ref="ruleForm" size="small">
        <el-form-item label="执行时间">
          <div style="width: 200px;">
            <el-date-picker
              size="small"
              v-model="daterange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="small" type="primary" icon="el-icon-search" class="margl-20" @click="search">查询</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table" v-loading="loading">
      <tree-table :data.sync="data" :expandAll="false" :multipleSelection.sync="multipleSelection">
        <!-- <el-table-column prop="name" label="名称" width="130px" :show-overflow-tooltip="true"></el-table-column> -->
        <!-- <el-table-column prop="name" label="项目名"></el-table-column> -->
        <el-table-column prop="job_type" label="类型" :formatter="formatterType"></el-table-column>
        <el-table-column prop="creator" label="执行人"></el-table-column>
        <el-table-column prop="execution_type" label="作业类型" :formatter="formatterExecutionType"></el-table-column>
        <el-table-column prop="execution_status" label="状态" :formatter="formatterExecutionStatus"></el-table-column>
        <el-table-column prop="result" label="结果"></el-table-column>
        <el-table-column prop="start_time" label="开始时间" width="160px"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="160px"></el-table-column>
        <el-table-column prop="time" label="执行耗时" :formatter="formatterTime"></el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row._level === 1">
              <el-button type="text" size="small" @click="startFlow(scope.row.execution_id)" :disabled="scope.row.execution_status !== 2">执行</el-button>
              <el-button type="text" size="small" @click="stopFlow(scope.row.execution_id)" :disabled="scope.row.execution_status !== 1">停止</el-button>
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
</template>

<script>
import TreeTable from './components/TreeTable'

import { getRecordListApi, startFlowApi, stopFlowApi } from '@/api/pe/flowManage/instantFlow'

export default {
  components: {
    TreeTable
  },
  data() {
    this.execution_type_map = {
      timed: '定时',
      cycle: '周期'
    }
    return {
      daterange: '',
      loading: false,
      form: {
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      multipleSelection: []
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      getRecordListApi(this.form).then(res => {
        const data = this.handleData(res.items)
        this.data = data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getListData(index) {
      this.loading = true
      const params = this.form
      if (index) {
        params.page = index
      }
      getRecordListApi(params).then(res => {
        const data = this.handleData(res.items)
        this.data = data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
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
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.multipleSelection = []
      this.init()
    },
    handlePageChange(val) {
      this.getListData(val)
    },
    formatterExecutionType(row) {
      return this.execution_type_map[row.execution_type]
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
    formatterExecutionStatus(row) {
      if (row.execution_status === 1) {
        return '执行中'
      } else if (row.execution_status === 2) {
        return '暂停'
      } else if (row.execution_status === 3) {
        return '停止'
      } else if (row.execution_status === 4) {
        return '完成'
      }
    },
    formatterTime(row) {
      if (row.time) {
        return row.time + 's'
      }
      return '/'
    },
    startFlow(id) {
      startFlowApi({ execution_id: id }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.refresh()
      })
    },
    stopFlow(id) {
      stopFlowApi({ execution_id: id }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.refresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.toolbar {
  display: flex;
  justify-content: space-between;
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
