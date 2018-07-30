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
        
      </el-form>

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          :data="data"
          :row-style="rowStyle"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="" label="执行时间"></el-table-column>
          <el-table-column prop="" label="执行人"></el-table-column>
          <el-table-column prop="" label="执行方式"></el-table-column>
          <el-table-column prop="" label="作业名"></el-table-column>
          <el-table-column prop="" label="作业类型"></el-table-column>
          <el-table-column prop="" label="系统类型"></el-table-column>
          <el-table-column prop="" label="目标IP"></el-table-column>
          <el-table-column prop="" label="执行耗时"></el-table-column>
          <el-table-column prop="" label="结束时间"></el-table-column>
          <el-table-column prop="" label="状态"></el-table-column>
          <el-table-column prop="" label="结果"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
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
export default {

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
