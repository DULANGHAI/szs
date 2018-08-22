<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      角色权限
    </div>
    <div class="container-body-wrap">
      <div class="file-nav">
        <div class="file-nav-right">
          <el-button size="small" @click.native="$refs.app.doCreate(false)">添加权限</el-button>
          <el-button size="small" >删除</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="listData"
      >
        <el-table-column prop="permission_name" label="权限名"></el-table-column>
        <el-table-column prop="resource_type_name" label="类型"></el-table-column>
        <el-table-column prop="operator_name" label="操作"></el-table-column>
        <el-table-column prop="created_at" :formatter="formatterTime" label="创建时间"></el-table-column>
      </el-table>
    </div>
    <div class="list-paging">
      <el-pagination
        background
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
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getRolePermission } from '@/api/systemManage/system.js'
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
      getRolePermission(this.$route.params.id, params).then(response => {
        this.listData = response
        this.tableLoading = false
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
