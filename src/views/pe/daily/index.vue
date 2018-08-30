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
            <el-form-item label="执行人">
              <el-input v-model="form.creator" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
                <router-link :to="'/pe/daily/detail/'+scope.row.execution_id">{{scope.row.execution_id}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="执行时间" width="160px" :formatter="formatterTime1"></el-table-column>
          <el-table-column prop="creator" label="执行人"></el-table-column>
          <el-table-column prop="name" label="作业名"></el-table-column>
          <el-table-column prop="system_type" label="系统类型"></el-table-column>
          <el-table-column label="目标IP">
            <template slot-scope="scope">
              <div v-if="scope.row.target_ip">
                <div v-for="(item, index) in scope.row.target_ip.split(',')" :key="index">
                  {{item}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="执行耗时"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="160px" :formatter="formatterTime2"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="result" label="结果"></el-table-column>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getLanguageApi } from '@/api/pe/jobManage/timedJob'
import { getExecutionListApi } from '@/api/pe/daily/index'

export default {
  components: {
    Breadcrumb,
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
      options: [
        {
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa'
            },
            {
              id: 'ab',
              label: 'ab'
            }
          ]
        },
        {
          id: 'b',
          label: 'b'
        },
        {
          id: '10.111.2.40',
          label: '10.111.2.40'
        }
      ],
      loading: false,
      form: {
        name: '',
        system_type: '',
        creator: '',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      systemAndLang: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([getLanguageApi(), getExecutionListApi(this.form)]).then(res => {
        this.systemAndLang = res[0]
        this.data = res[1].items
        this.total = res[1].total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTime1(row) {
      if (row.created_at) {
        return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    formatterTime2(row) {
      if (row.end_time) {
        return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    // formatterIp(row) {
    //   const data = row.target_ip.split(',')
    //   return data.toString()
    // },
    getListData(index) {
      this.loading = true
      const params = this.form
      if (index) {
        params.page = index
      }
      getExecutionListApi(params).then(res => {
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
        creator: '',
        page: 1,
        per_page: 10
      }
      this.multipleSelection = []
      this.init()
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
