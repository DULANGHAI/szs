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
            <el-form-item label="任务名">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option :label="'命令'" :value="'command'"></el-option>
                <el-option :label="'脚本'" :value="'script'"></el-option>
                <el-option :label="'文件分发'" :value="'file'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="风险">
              <el-select v-model="form.risk_level" placeholder="请选择">
                <el-option :label="'低'" :value="'1'"></el-option>
                <el-option :label="'中'" :value="'2'"></el-option>
                <el-option :label="'高'" :value="'3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建者">
              <el-select v-model="form.creator" placeholder="请选择">
                <el-option v-for="name in creaters" :key="name" :label="name" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="审批者">
              <el-select v-model="form.approver" placeholder="请选择">
                <el-option v-for="name in approvers" :key="name" :label="name" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审批状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option :label="'通过'" :value="'pass'"></el-option>
                <el-option :label="'拒绝'" :value="'no-pass'"></el-option>
                <el-option :label="'审核中'" :value="'pending'"></el-option>
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

        <el-row :gutter="20">
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-70" @click="search">查询</el-button>
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
          <el-table-column prop="name" label="任务名称" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="updated_at" label="修改时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="type" label="任务类型" :formatter="formatterTaskType"></el-table-column>
          <el-table-column prop="task_description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column label="审批人" width="200px"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <el-tooltip placement='top' title='标题'>
                <div slot="content">
                  <span v-for="(item, index) in scope.row.approve_record" :key="index">
                    <span :class="item.status === 'pass' ? 'green-circle' : (item.status === 'no-pass' ? 'red-circle' : 'dark-circle')"></span>
                    {{item.approver}}
                  </span>
                </div>
                <div class="approver-container">
                  <span v-for="(item, index) in scope.row.approve_record" :key="index">
                    <span :class="item.status === 'pass' ? 'green-circle' : (item.status === 'no-pass' ? 'red-circle' : 'dark-circle')"></span>
                    {{item.approver}}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column label="操作" fixed="right" width="70">
            <template slot-scope="scope">
              <el-button type="text" @click="goView(scope.row)">查看</el-button>
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

import { getListApi, getCreatorApi, getApproverApi } from '@/api/pe/taskManage/taskApprove'

const taskTypeMap = {
  command: '命令',
  script: '脚本',
  file: '文件分发'
}
// const taskStatusMap = {
//   pass: '通过',
//   'no-pass': '拒绝',
//   pending: '审核中'
// }

export default {
  name: 'example1',
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: '',
        risk_level: '',
        creator: '',
        approver: '',
        status: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      daterange: '',
      data: [],
      total: 0,
      creaters: [],
      approvers: []
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  created() {
    this.loading = true
    Promise.all([getListApi(this.form), getCreatorApi(), getApproverApi()])
      .then(res => {
        this.data = res[0].items
        this.total = res[0].total
        this.creaters = res[1].creator
        this.approvers = res[2].approver
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
  },
  methods: {
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
    handlePageChange(val) {
      this.form.page = val
      this.getListData()
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTaskType(row) {
      return taskTypeMap[row.type]
    },
    renderHeader(h, { column, $index }) {
      return (
        <span>
          审批人
          <el-tooltip placement='top' title='标题' trigger='hover'>
            <div slot='content'>
              <span class='dark-circle'></span><span style='margin-right: 6px;'>审批中</span>
              <span class='green-circle'></span><span style='margin-right: 6px;'>审批通过</span>
              <span class='red-circle'></span><span>审批拒绝</span>
            </div>
            <i class='el-icon-info'></i>
          </el-tooltip>
        </span>
      )
    },
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        name: '',
        type: '',
        risk_level: '',
        creator: '',
        approver: '',
        status: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.search()
    },
    goView(row) {
      if (row.status === '审批中') { // 审核中，可操作
        this.$router.push({
          path: `/pe/taskManage/approveTask/${row.id}`
        })
      } else {
        this.$router.push({
          path: `/pe/taskManage/approveView/${row.id}/1`
        })
      }
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
.approver-container {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
  white-space: nowrap;
}
.flex-nowrap {
  display: flex;
  flex-wrap: nowrap;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
