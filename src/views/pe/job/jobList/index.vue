<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <!-- 筛选 -->
      <el-form
        size="small"
        label-width="70px"
        label-position="right">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="作业名">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统">
              <el-select v-model="form.system_type" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(systemAndLang)" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-20" @click="search">查询</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-select v-model="form.creator" placeholder="请选择">
                <el-option v-for="(item, index) in job_creator_arr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                size="small"
                v-model="daterange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作条 -->
      <div class="toolbar">
        <el-button size="small" type="primary" icon="el-icon-plus" plain @click="goAdd">添加</el-button>
        <div>
          <el-button size="small" plain :disabled="multipleStart" @click="handleMultipleStart">启用</el-button>
          <el-button size="small" plain :disabled="multipleStop" @click="handleMultipleStop">停用</el-button>
          <el-button size="small" type="danger" plain :disabled="multipleDelete" @click="handleMultipleDelete">删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          :row-style="rowStyle"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="system_type" label="系统类型"></el-table-column>
          <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
          <el-table-column prop="description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatterEnable"></el-table-column>
          <el-table-column prop="frequency" label="执行次数"></el-table-column>
          <el-table-column prop="success_rate" label="成功率"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goEdit(scope.row.id)" :disabled="scope.row.status">编辑</el-button>
              <el-button type="text" size="small" @click="goView(scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="handleSingleStatus(scope.row)">{{scope.row.status ? '停用' : '启用'}}</el-button>
              <el-button type="text" size="small" class="danger" @click="handleSingleDelete(scope.row.id)" :disabled="scope.row.status">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total">
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'

import { getLanguageApi, getJobListApi, changeJobStatusApi, deleteJobApi } from '@/api/pe/jobManage/jobList'

export default {
  components: {
    Breadcrumb,
    RiskLevel
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
      form: {
        name: '',
        system_type: '',
        type: '',
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      systemAndLang: {},
      job_creator_arr: [],
      daterange: '',
      multipleSelection: [],
      multipleStart: true,
      multipleStop: true,
      multipleDelete: true,
      data: [],
      total: 0
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    },
    multipleSelection(arr) {
      const length = arr.length
      if (length) {
        let enable = 0
        for (let i = 0; i < length; i++) {
          if (arr[i].status) {
            enable++
          }
        }
        if (enable === length) {
          this.multipleStart = true
          this.multipleStop = false
          this.multipleDelete = true
        } else if (enable === 0) {
          this.multipleStart = false
          this.multipleStop = true
          this.multipleDelete = false
        } else {
          this.multipleStart = true
          this.multipleStop = true
          this.multipleDelete = true
        }
      } else {
        this.multipleStart = true
        this.multipleStop = true
        this.multipleDelete = true
      }
    }
  },
  created() {
    this.loading = true
    Promise.all([getLanguageApi(), getJobListApi(this.form)]).then(res => {
      this.systemAndLang = res[0]
      this.data = res[1].items
      this.total = res[1].total
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      if (!row.status) {
        return {
          color: '#BFBFBF'
        }
      }
    },
    formatterTime(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterEnable(row) {
      if (row.status) {
        return '启用'
      }
      return '停用'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePageChange(val) {
      this.getListData(val)
    },
    getListData(index) {
      this.loading = true
      const params = this.form
      if (index) {
        params.page = index
      }
      getJobListApi(params).then(res => {
        this.data = res.items
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        name: '',
        system_type: '',
        type: '',
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.multipleSelection = []
      this.search()
    },
    goAdd() {
      this.$router.push({
        path: '/pe/jobManage/jobAdd'
      })
    },
    goEdit(id) {
      this.$router.push({
        path: `/pe/jobManage/jobEdit/${id}`
      })
    },
    goView(id) {
      this.$router.push({
        path: `/pe/jobManage/jobView/${id}/1`
      })
    },
    getJobIds() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    changeTaskStatus(data) {
      changeJobStatusApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    deleteTasks(data) {
      deleteJobApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    handleMultipleStart() {
      this.$confirm('确认要启用这些作业吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const ids = this.getJobIds()
        this.changeTaskStatus({
          job_ids: ids,
          status: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },
    handleMultipleStop() {
      this.$confirm('确认要停用这些任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.getJobIds()
        this.changeTaskStatus({
          job_ids: ids,
          status: false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        })
      })
    },
    handleMultipleDelete() {
      this.$confirm('确认要删除这些任务吗？', '提示', {
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
    handleSingleStatus(row) {
      if (row.status) { // 处在启用状态，要停用
        this.$confirm('确认要停用这条任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          ids.push(row.id)
          this.changeTaskStatus({
            job_ids: ids,
            status: false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          })
        })
      } else {
        this.$confirm('确认要启用这条任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          const ids = []
          ids.push(row.id)
          this.changeTaskStatus({
            job_ids: ids,
            status: true
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      }
    },
    handleSingleDelete(id) {
      this.$confirm('确认要删除这条任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        ids.push(id)
        this.deleteTasks({
          job_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container-body {
  margin: 24px;
  padding: 29px 32px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.margl-20 {
  margin-left: 20px;
}
.toolbar {
  margin-top: 30px;
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
.danger {
  color: #f56c6c;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
