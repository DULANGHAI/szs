<template>
  <div class="container-body">
    <!-- 表格 -->
    <el-table
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
      <el-table-column prop="start_time" label="执行时间" width="160px"></el-table-column>
      <el-table-column prop="creator" label="执行人"></el-table-column>
      <el-table-column prop="execution_type" label="执行方式" :formatter="formatterExecutionType"></el-table-column>
      <el-table-column prop="name" label="作业名"></el-table-column>
      <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
      <el-table-column prop="system_type" label="系统类型"></el-table-column>
      <el-table-column prop="target_ip" label="目标IP" :formatter="formatterTargetIp"></el-table-column>
      <el-table-column prop="time" label="执行耗时"></el-table-column>
      <el-table-column prop="end_time" label="结束时间" width="160px"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="result" label="结果"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination" v-if="total">
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getDistributionListApi } from '@/api/pe/fileManage/fileDispense'

export default {
  data() {
    this.execution_type_map = {
      instant: '即时作业',
      timed: '定时作业'
    }
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查',
      distribution: '文件分发'
    }
    return {
      loading: false,
      form: {
        job_type: 'distribution',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 记录
    getListData(index) {
      this.loading = true
      const params = this.form
      if (index) {
        params.page = index
      }
      getDistributionListApi(params).then(res => {
        this.loading = false
        this.data = res.items
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 翻页
    handlePageChange(val) {
      this.form.page = val
      this.getListData()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
