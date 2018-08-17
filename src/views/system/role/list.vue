<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      超级管理员
    </div>
    <div class="container-body-wrap">
      <el-form
        size="small"
        style="padding-bottom: 20px;"
        @submit.native.prevent="submit"
      >
        <el-row>
          <el-col :span="6">
            <el-input
              placeholder="请搜索"
              suffix-icon="el-icon-search"
              v-model="keyword"
            >
            </el-input>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="permission" label="权限">
          <template slot-scope="{ row }">
            <el-tag
              v-for="permission in row.permission"
              :key="permission"
            >
              {{ permission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource_type" label="资源类型"></el-table-column>
        <el-table-column prop="resource_type" label="资源操作"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="desc" label="描述"> </el-table-column>
      </el-table>
      <div class="list-paging">
        <el-pagination
          v-if="this.totalPage > 0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="this.pageSizesArray"
          :page-size="this.pageSize"
          :total="this.totalPage"
          layout="prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getAdduserApi, getrolesId, getonepermissions } from '@/api/systemManage/system.js'

export default {
  mixins: [common],
  components: {
    Breadcrumb
  },
  data() {
    return {
      currentPage: 1,
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 0,
      totalPage: 0,
      keyword: '',
      tableLoading: true,
      tableData: [],
      id: ''
    }
  },
  mounted() {

  },
  created() {
    // getrolesId().then(res=>{
    //       this.id=res.
    //         console.log(res)
    //         }).catch(error=>{
    //         })
    setTimeout(() => {
      this.tableLoading = false
      this.tableData = [
        {
          permission: ['1', '2'],
          resource_type: 'rt1',
          resource_action: 'ra1',
          created_at: '2018-07-25T04:31:00.499Z',
          desc: 'desc1'
        },
        {
          permission: ['2', '3'],
          resource_type: 'rt2',
          resource_action: 'ra2',
          created_at: '2018-07-25T04:31:00.499Z',
          desc: 'desc2'
        }
      ]
      this.currentPage = 1
      this.totalPage = 2
    }, 2000)
  },
  methods: {
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 选择展示页数
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    // 选择当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    submit() {
      console.log('submit', this.keyword)
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
