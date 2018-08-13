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
            <router-link :to="'/pe/jobManage/jobRecord/:'+scope.row.execution_id">{{scope.row.execution_id}}</router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="权限"></el-table-column>
      <el-table-column prop="" label="所有者"></el-table-column>
      <el-table-column prop="" label="用户组"></el-table-column>
      <el-table-column prop="" label="大小"></el-table-column>
      <el-table-column prop="updated_at" label="上传时间"></el-table-column>
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
