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
      <el-form size="small" label-width="70px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="form.task_name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="form.operation_type" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(operation_type_map)" :key="index" :label="operation_type_map[item]" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(job_status_map)" :key="index" :label="job_status_map[item]" :value="item"></el-option>
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
            <el-form-item label="执行人">
              <el-select v-model="form.operator">
                <el-option v-for="(item, index) in operator_arr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="审批人">
              <el-select v-model="form.approver">
                <el-option v-for="(item, index) in approver_arr" :key="index" :label="item.name" :value="item.id"></el-option>
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

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="created_at" label="提交时间" width="160px" :formatter="formatterTime1"></el-table-column>
          <el-table-column prop="operator" label="执行人" width="100px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="operation_type" label="类型" :formatter="formatterType"></el-table-column>
          <el-table-column prop="task_name" label="名称" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="target" label="目标IP" width="160px" :show-overflow-tooltip="true" :formatter="formatterIp"></el-table-column>
          <el-table-column prop="execute_time" label="开始时间" width="160px" :formatter="formatterTime2"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatterStatus"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goDetail(scope)">详情</el-button>
              <el-button type="text" size="small" @click="pass(scope)" :disabled="scope.row.status !== '1'">通过</el-button>
              <el-button type="text" size="small" @click="nopass(scope)" :disabled="scope.row.status !== '1'">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作model -->
      <approve-model ref="approveModel" :refresh="refresh"></approve-model>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import ApproveModel from './components/ApproveModel'

import { getListApi } from '@/api/pe/peApprove'

export default {
  components: {
    Breadcrumb,
    RiskLevel,
    ApproveModel
  },
  data() {
    this.operation_type_map = {
      '1': '即时作业',
      '2': '定时作业',
      '3': '即时流程',
      '4': '定时流程'
    }
    this.job_status_map = {
      '1': '审核中',
      '2': '审核通过',
      '3': '审核不通过'
    }
    return {
      loading: false,
      form: {
        task_name: '',
        operation_type: '',
        status: '',
        operator: '',
        approver: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      operator_arr: [],
      approver_arr: [],
      daterange: '',
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
    Promise.all([getListApi(this.form)])
      .then(res => {
        this.data = res[0].items
        this.total = res[0].total
      })
  },
  methods: {
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        task_name: '',
        operation_type: '',
        status: '',
        operator: '',
        approver: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.search()
    },
    goDetail(scope) {},
    pass(scope) {
      this.$refs.approveModel.setData(scope.row.task_id, '2')
      this.$refs.approveModel.showModel()
    },
    nopass(scope) {
      this.$refs.approveModel.setData(scope.row.task_id, '3')
      this.$refs.approveModel.showModel()
    },
    getListData(index) {
      const params = this.form
      if (index) {
        params.page = index
      }
      this.loading = true
      getListApi(params).then(res => {
        this.data = res.items
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatterTime1(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      return this.$dayjs(row.execute_time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterType(row) {
      return this.operation_type_map[row.operation_type]
    },
    formatterIp(row) {
      return JSON.parse(row.target).host.toString()
    },
    formatterStatus(row) {
      return this.job_status_map[row.status]
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
.margl-70 {
  margin-left: 70px;
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
