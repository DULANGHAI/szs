<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      权限浏览
    </div>
    <div class="container-body-wrap">
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="listData"
      >
        <el-table-column prop="permission" label="权限"></el-table-column>
        <el-table-column prop="resource" label="权限类型"></el-table-column>
        <el-table-column prop="operation" label="权限操作"></el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
      </el-table>
      <div class="list-paging">
        <el-pagination
          background
          v-if="this.totalPage > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="this.pageSizesArray"
          :page-size="this.pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="this.totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getPermission } from '@/api/systemManage/system.js'
import { Message } from 'element-ui'

export default {
  mixins: [common],
  components: {
    Breadcrumb
  },
  data() {
    return {
      listData: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0, // list总数
      tableLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      var params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10
      }
      getPermission(params).then(response => {
        this.listData = response.items
        this.tableLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
    },
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    // 选择展示页数
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSizes = val
      this.getList()
      // console.log(`每页 ${val} 条`)
    },
    // 选择当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
      // console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-buttons {
  text-align: right;
  padding-bottom: 20px;
}
</style>
