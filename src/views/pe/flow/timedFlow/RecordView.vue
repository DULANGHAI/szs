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
        <el-table-column prop="name" label="项目名"></el-table-column>
        <el-table-column prop="job_type" label="类型" :formatter="formatterType"></el-table-column>
        <el-table-column prop="executor" label="执行人"></el-table-column>
        <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
        <el-table-column prop="" label="定时配置"></el-table-column>
        <el-table-column prop="" label="状态"></el-table-column>
        <el-table-column prop="result" label="结果"></el-table-column>
        <el-table-column prop="start_time" label="开始时间" :formatter="formatterTime1"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" :formatter="formatterTime2"></el-table-column>
        <el-table-column prop="time" label="执行耗时"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="startFlow(scope.row.execution_id)">执行</el-button>
            <el-button type="text" size="small" @click="stopFlow(scope.row.execution_id)">停止</el-button>
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
import TreeTable from '../instantFlow/components/TreeTable'

import { getRecordListApi, startFlowApi, stopFlowApi } from '@/api/pe/flowManage/timedFlow'

export default {
  components: {
    TreeTable
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
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
        this.data = res.items
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
        this.data = res.items
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
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTime1(row) {
      return this.$dayjs(row.start_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      if (row.end_time) {
        return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
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
