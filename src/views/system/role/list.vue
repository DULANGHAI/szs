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
          <el-button size="small" @click.native="perDelete" :disabled="isDelete">删除</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="listData"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column prop="permission" label="权限名"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
        <el-table-column prop="resource" label="资源"></el-table-column>
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
    <add-role-permission ref="app" v-on:getList="getList" :id="isId"></add-role-permission>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getRolePermission, delRolePermission } from '@/api/systemManage/system.js'
import { Message, MessageBox } from 'element-ui'
import AddRolePermission from './addRolePermission'

export default {
  mixins: [common],
  components: {
    Breadcrumb,
    AddRolePermission
  },
  data() {
    return {
      listData: [],
      SelectionArray: [],
      multipleSelection: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0, // list总数
      tableLoading: false,
      isId: ''
    }
  },
  created() {
    this.getList()
    this.isId = this.$route.params.id
  },
  computed: {
    isDelete() {
      return !(this.multipleSelection.length > 0)
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      var params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10
      }
      getRolePermission(this.$route.params.id, params).then(response => {
        this.listData = response.items
        this.tableLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      var sary_path = []
      for (const item in val) {
        sary_path.push(val[item].id)
      }
      this.SelectionArray = sary_path
    },
    perDelete() {
      MessageBox.confirm('此操作将永久删除该权限，是否继续', '删除角色权限', { type: 'error' }).then(() => {
        var params = {
          'permission_ids': this.SelectionArray
        }
        delRolePermission(this.$route.params.id, params).then(response => {
          this.getList()
          Message.success('删除成功')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
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
