<template>
  <div class="page-audit">
    <Breadcrumb></Breadcrumb>

    <div class="container-title">
      系统审计
    </div>

    <div class="container-body-wrap review-body">
      <el-form
        size="small"
        label-width="70px"
        label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="queryForm.datatime"
                type="daterange"
                style="width:100%"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户">
              <el-select v-model="queryForm.user" style="width: 100%">
                <el-option
                  v-for="item in userList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>  
          </el-col>
          <el-col :span="6">
            <el-form-item label="源IP">
              <el-input v-model="queryForm.source_ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源类型">
              <el-select v-model="queryForm.resource_type" style="width: 100%" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源ID">          
                 <el-input v-model="queryForm.resource_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作">
              <el-input v-model="queryForm.operation"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-autocomplete
                  v-model="queryForm.status"
                  :fetch-suggestions="statusAutoSearch"
                  @select="handleSelect"
                ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息">
              <el-input v-model="queryForm.message"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="file-nav">
        <div class="file-nav-right">
          <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              class="margl-70"
              @click.native="getList">查询
            </el-button>
            <el-button size="small" @click.native="audit" icon="el-icon-printer">导出</el-button>
            <el-button size="small" @click.native="searchReset">重置</el-button>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="listLoading"
        :data="tableData">
        <el-table-column prop="created_at" label="时间" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="source_ip" label="源IP"></el-table-column>
        <el-table-column label="资源ID">
          <template slot-scope="scope">
            <router-link :to="jumper1"><el-button type="text">{{ scope.row.resource_id }}</el-button></router-link>
          </template>  
        </el-table-column>
        <el-table-column prop="resource" label="资源类型"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
        <el-table-column prop="status" label="结果"></el-table-column>
        <el-table-column prop="message" label="消息"></el-table-column>
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
import common from './common'
import { UserSearch, Resources, getAudit, searchStatus } from '@/api/systemManage/system.js'
import { Message } from 'element-ui'

var queryFormData = {
  'datatime': []
}
export default {
  name: 'audit',
  mixins: [common],
  components: {
    Breadcrumb,
    common
  },
  data() {
    return {
      userList: [],
      typeList: [],
      tableData: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0, // list总数
      listLoading: false,
      jumper1: '',
      queryForm: JSON.parse(JSON.stringify(queryFormData))
    }
  },
  mounted() {
    UserSearch().then(res => {
      this.userList = res.creator
    }).catch(error => {
      Message.error(error)
    })
    Resources().then(res => {
      this.typeList = res.resource
    }).catch(error => {
      Message.error(error)
    })
  },
  created() {
    this.getList()
  },
  methods: {
    searchReset() {
      this.queryForm = JSON.parse(JSON.stringify(queryFormData))
      this.getList()
    },
    statusAutoSearch(queryString, cb) {
      const params = {
        'status': queryString
      }
      var list = []
      searchStatus(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.status
          })
        }
        cb(this.unique(list))
      }).catch(error => {
        Message.error(error)
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getList() {
      var searchParams = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10,
        'end_time': this.queryForm.datatime && this.queryForm.datatime[1] || null,
        'start_time': this.queryForm.datatime && this.queryForm.datatime[0] || null,
        'user': this.queryForm.user,
        'source_ip': this.queryForm.source_ip,
        'resource_type': this.queryForm.resource_type,
        'resource_id': this.queryForm.resource_id,
        'operation': this.queryForm.operation,
        'status': this.queryForm.status,
        'message': this.queryForm.message
      }
      this.listLoading = true
      getAudit(searchParams).then(res => {
        this.tableData = res.items
        this.listLoading = false
      }).catch(error => {
        Message.error(error)
      })
    },
    audit() {
      var params = {
        'end_time': this.queryForm.datatime && this.queryForm.datatime[1] || null,
        'start_time': this.queryForm.datatime && this.queryForm.datatime[0] || null,
        'user': this.queryForm.user,
        'source_ip': this.queryForm.source_ip,
        'resource_type': this.queryForm.resource_type,
        'resource_id': this.queryForm.resource_id,
        'operation': this.queryForm.operation,
        'status': this.queryForm.status,
        'message': this.queryForm.message
      }
      window.open('/v1/audit/download' + params)
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
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
</style>
