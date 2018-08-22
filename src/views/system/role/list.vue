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
      tableLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      getRolePermission(this.$route.params.id).then(response => {
        this.listData = response
        this.tableLoading = false
      }).catch(error => {
        Message.error(error)
      })
    },
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
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
