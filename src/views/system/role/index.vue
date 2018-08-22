<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      角色管理
    </div>
    <!-- 列表 -->
    <div class="container-body-wrap">
      <el-row class="table-buttons">
        <el-button size="small" @click.native="createRole">添加角色</el-button>
        <el-button size="small" @click.native="editRole" :disabled="isEdit">重命名</el-button>
        <el-button size="small" @click.native="removeRole" :disabled="isDelete">删除角色</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="listData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="角色ID" width="100"></el-table-column>
        <el-table-column prop="name" label="角色名"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="create_user" label="创建人"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="goInfo(scope.row.id)">查看权限</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <add-role ref="app" v-on:getList="getList"></add-role>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getRoles, deleteRoles } from '@/api/systemManage/system.js'
import { Message, MessageBox } from 'element-ui'
import AddRole from './addRole'

export default {
  mixins: [common],
  components: {
    Breadcrumb,
    AddRole
  },
  data() {
    return {
      tableLoading: false,
      multipleSelection: [],
      SelectionArray: [],
      listData: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0, // list总数
      // 角色数据
      roles: [],
      role: {
        rolename: '',
        passward: '',
        name: ''
      },
      permission: {},
      // 弹出框
      dialogType: 'roleCreate',
      dialogVisible: false,
      rulesRole: {
        rolename: [
          {
            required: true,
            message: '角色不能为空',
            trigger: 'blur'
          }
        ],
        passward: [
          {
            required: true,
            message: '备注不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ]
      },
      rulesPermission: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ]
      },
      options: [],
      value: ''
    }
  },
  computed: {
    isEdit() {
      return !this.multipleSelection.length === 1
    },
    isDelete() {
      return !this.multipleSelection.length === 1
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
      getRoles(params).then(response => {
        this.listData = response.items
        this.tableLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
    },
    createRole() {
      this.$refs.app.doCreate(false)
    },
    editRole() {
      this.$refs.app.doCreate(true, this.multipleSelection[0])
    },
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    removeRole() {
      MessageBox.confirm('此操作将永久删除该角色，是否继续', '删除角色', { type: 'error' }).then(() => {
        deleteRoles(this.multipleSelection[0].id).then(response => {
          this.getList()
          Message.success('删除成功')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
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
    // 角色权限
    goInfo(id) {
      this.$router.push({
        name: 'rolePermission',
        params: {
          id: id
        }
      })
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
