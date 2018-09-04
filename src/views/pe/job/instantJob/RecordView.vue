<template>
  <div class="container">
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
          <el-form-item label="系统类型">
            <el-select v-model="form.system_type">
              <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业类型">
            <el-select v-model="form.job_type">
              <el-option v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人">
            <el-select v-model="form.creator">
              <el-option v-for="item in creator_arr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="执行时间">
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
        <el-col :span="6" :offset="6">
          <el-button size="small" type="primary" icon="el-icon-search" class="margl-20" @click="search">查询</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="table"
        v-loading="loading"
        :data="data"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column label="执行ID" width="160px">
          <template slot-scope="scope">
            <div class="link">
              <router-link :to="'/pe/jobManage/jobRecord/'+scope.row.execution_id">{{scope.row.execution_id}}</router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="执行时间" width="160px" :formatter="formatterTime1"></el-table-column>
        <el-table-column prop="creator" label="执行人"></el-table-column>
        <el-table-column prop="name" label="作业名"></el-table-column>
        <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
        <el-table-column prop="system_type" label="系统类型"></el-table-column>
        <el-table-column prop="target_ip" label="目标IP" width="160px" :formatter="formatterIp" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="time" label="执行耗时"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="160px" :formatter="formatterTime2"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="result" label="结果"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '执行中'">
              <el-button type="text" size="small" disabled="">执行</el-button>
              <el-button type="text" size="small" @click="stopJob(scope.row.execution_id)">停止</el-button>
            </div>
            <div v-else-if="scope.row.status === '执行结束'">
              <el-button type="text" size="small" @click="startJob(scope.row.execution_id)">执行</el-button>
              <el-button type="text" size="small" disabled="">停止</el-button>
            </div>
            <div v-else-if="scope.row.status === '等待'">
              <el-button type="text" size="small" @click="deleteJob(scope.row.execution_id)">删除</el-button>
            </div>
            <div v-if="scope.row.status === '停止'">
              <el-button type="text" size="small" disabled="">执行</el-button>
              <el-button type="text" size="small" disabled="">停止</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="total">
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getLanguageApi, getRecordListApi, getCreatorApi, startJobApi, stopJobApi, deleteJobApi } from '@/api/pe/jobManage/instantJob'

export default {
  components: {
    Treeselect
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
        job_type: '',
        creator: '',
        start_time: '',
        end_time: '',
        execution_type: 'instant',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      systemAndLang: {},
      creator_arr: [],
      daterange: '',
      interval: ''
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
    this.startInterval()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([getLanguageApi(), getRecordListApi(this.form), getCreatorApi()]).then(res => {
        this.systemAndLang = res[0]
        this.data = res[1].items
        this.total = res[1].total
        this.creator_arr = res[2].creator
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    startInterval() {
      this.interval = setInterval(() => {
        this.getListData()
      }, 5000)
    },
    stopInterval() {
      clearInterval(this.interval)
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTime1(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      if (row.end_time) {
        return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    formatterIp(row) {
      return row.target_ip.split(',').toString()
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
        this.stopInterval()
      })
    },
    handlePageChange(val) {
      this.getListData(val)
    },
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        name: '',
        system_type: '',
        job_type: '',
        creator: '',
        start_time: '',
        end_time: '',
        execution_type: 'instant',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.multipleSelection = []
      this.init()
    },
    startJob(id) {
      startJobApi({ execution_id: id }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.refresh()
      })
    },
    stopJob(id) {
      stopJobApi(id).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.refresh()
      })
    },
    deleteJob(id) {
      deleteJobApi({ execution_id: id }).then(res => {
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
  & /deep/ .el-select {
    width: 100%;
  }
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
.link {
  color: #409EFF;
}
</style>
