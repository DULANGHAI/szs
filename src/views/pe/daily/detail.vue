<template>
  <div class="container">
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
            <el-form-item label="系统类型">
              <el-select v-model="form.system_type">
                <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="结果">
              <el-select v-model="form.result">
                <el-option v-for="item in result_arr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="执行ID">
              <el-input v-model="form.execution_id" placeholder="请输入"></el-input>
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
          <el-table-column prop="name" label="作业名"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="system_type" label="系统类型"></el-table-column>
          <el-table-column prop="target_ip" label="目标IP" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="result" label="结果"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="view(scope.row.execution_id, scope.row.target_ip)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total">
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
      </div>

    </div>

    <!-- 执行log -->
    <log-view ref="logView"></log-view>

  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import LogView from './components/LogView'

import { getLanguageApi } from '@/api/pe/jobManage/timedJob'
import { getJobListApi } from '@/api/pe/daily/index'
import { getLogDetailApi } from '@/api/pe/jobManage/jobRecord'

export default {
  props: ['id'],
  components: {
    Breadcrumb,
    Treeselect,
    LogView
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
        target_ip: [],
        result: '',
        execution_id: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      systemAndLang: {},
      result_arr: [],
      check_item_arr: [],
      daterange: ''
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  created() {
    if (this.id && this.id !== ':id') {
      this.form.execution_id = this.id
    }
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([getLanguageApi(), getJobListApi(this.form)]).then(res => {
        this.systemAndLang = res[0]
        this.data = res[1].items
        this.total = res[1].total
      }).finally(() => {
        this.loading = false
      })
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTime1(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
    },
    getListData(index) {
      this.loading = true
      const params = {
        name: this.form.name,
        system_type: this.form.system_type,
        target_ip: JSON.stringify({
          host: this.form.target_ip
        }),
        result: this.form.result,
        execution_id: this.form.execution_id,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        page: this.form.page,
        per_page: this.form.per_page
      }
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
        target_ip: [],
        result: '',
        execution_id: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.multipleSelection = []
      this.init()
    },
    view(execution_id, target_ip) {
      this.$refs.logView.showModel()

      getLogDetailApi(execution_id, target_ip).then(res => {
        this.$refs.logView.setData(res.execution_log)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
  padding: 29px 32px;
  border-radius: 4px;
  background-color: #fff;
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
