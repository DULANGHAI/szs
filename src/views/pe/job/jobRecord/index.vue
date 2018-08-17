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
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="执行ID">
              <el-input v-model="form.execution_id" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="form.job_type" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
              </el-select>
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
            <el-form-item label="作业名">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="执行方式">
              <el-select v-model="form.execution_type">
                <el-option label="即时作业" :value="'instant'"></el-option>
                <el-option label="定时作业" :value="'timed'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="目标IP">
              <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="执行人">
              <el-select v-model="form.creator">
                <el-option v-for="item in creator_arr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
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
          <el-col :span="6" :offset="12">
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
          <el-table-column prop="execution_id" label="执行ID" width="160px"></el-table-column>
          <el-table-column prop="start_time" label="执行时间" width="160px" :formatter="formatterTime1"></el-table-column>
          <el-table-column prop="creator" label="执行人"></el-table-column>
          <el-table-column prop="execution_type" label="执行方式" :formatter="formatterExecutionType"></el-table-column>
          <el-table-column prop="name" label="作业名"></el-table-column>
          <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
          <el-table-column prop="system_type" label="系统类型"></el-table-column>
          <el-table-column prop="target_ip" label="目标IP" :formatter="formatterTargetIp"></el-table-column>
          <el-table-column prop="time" label="执行耗时"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="160px" :formatter="formatterTime2"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="result" label="结果"></el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goView(scope.row.id)">查看</el-button>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getLanguageApi, getCreatorApi, getListApi } from '@/api/pe/jobManage/jobRecord'

export default {
  props: ['id'],
  components: {
    Breadcrumb,
    RiskLevel,
    Treeselect
  },
  data() {
    this.execution_type_map = {
      instant: '即时作业',
      timed: '定时作业'
    }
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
      daterange: '',
      form: {
        execution_id: '',
        job_type: '',
        system_type: '',
        name: '',
        execution_type: '',
        target_ip: [],
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      systemAndLang: {},
      creator_arr: [],
      data: [],
      total: 0
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  created() {
    if (this.id) {
      this.form.execution_id = this.id
    }
    this.init()
  },
  methods: {
    formatterTime1(row) {
      return this.$dayjs(row.start_time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterExecutionType(row) {
      return this.execution_type_map[row.execution_type]
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTargetIp(row) {
      // return JSON.parse(row.target_ip).host.toString()
      return row.target_ip
    },
    init() {
      this.loading = true
      Promise.all([getLanguageApi(), getListApi(this.form), getCreatorApi()])
        .then(res => {
          this.systemAndLang = res[0]
          this.data = res[1].items
          this.total = res[1].total
          this.creator_arr = res[2].creator
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
      getListApi(params).then(res => {
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
    refresh() {},
    goView(id) {
      this.$router.push({
        path: `/pe/jobManage/recordDetail/${id}`
      })
    },
    handlePageChange(val) {
      this.getListData(val)
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
.margl-20 {
  margin-left: 20px;
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
