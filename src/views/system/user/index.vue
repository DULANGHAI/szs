<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      用户管理
    </div>
    <!-- 列表 -->
    <div class="container-body-wrap">
      <el-row class="table-buttons">
        <el-button size="small" @click.native="$refs.app.doCreate(false)">添加用户</el-button>
        <el-button size="small" @click.native="openUser" :disabled="!selectedOne">启用</el-button>
        <el-button size="small" @click.native="closeUser" :disabled="!selectedOne">停用</el-button>
        <el-button size="small" :disabled="!selectedOne" @click.native="$refs.app.doCreate(true, multipleSelection[0])">修改</el-button>
        <el-button size="small" @click.native="usersDelete(SelectionArray)" :disabled="!selected">删除</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="listLoading"
        :data="listData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="用户ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime" width="160"></el-table-column>
        <el-table-column prop="business" label="所属业务">
          <template slot-scope="scope">
            <el-tag v-for="(df, index) in scope.row.business_names" :key="index">{{ df }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="telephone" label="手机"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag v-for="(vr, index) in scope.row.role_names" :key="index">{{ vr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="status"
          label="状态"
          :filters="statusFilterOptions"
          :filter-method="filterStatusMethod"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | status('theme')">{{scope.row.status | status}}</el-tag>
          </template>
        </el-table-column>
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
    <add-user ref="app" v-on:getList="getList"></add-user>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { openclose, delUsers } from '@/api/systemManage/system.js'
import { queryUserApi } from '@/api/systemManage/system.js'
import AddUser from './addUser'
import { Message, MessageBox } from 'element-ui'

export default {
  mixins: [common],
  components: {
    Breadcrumb,
    AddUser
  },
  data() {
    return {
      multipleSelection: [],
      listLoading: false,
      listData: [],
      SelectionArray: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0, // list总数
      statusFilterOptions: [
        { text: '启用', value: 1 },
        { text: '停用', value: 0 }
      ]
    }
  },
  computed: {
    selected() {
      return Boolean(this.multipleSelection.length)
    },
    selectedOne() {
      return this.multipleSelection.length === 1
    },
    multipleSelectionFilter() {
      return this.users.filter(item => {
        return !~this.multipleSelection.indexOf(item)
      })
    }
  },
  watch: {
    dialogVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs['form-user'].clearValidate()
        })
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      var params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10
      }
      this.listLoading = true
      queryUserApi(params).then(res => {
        this.listData = res.items
        this.listLoading = false
        this.totalPage = res.total
      }).catch(error => {
        Message.error(error)
      })
    },
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    filterStatusMethod(value, row) {
      return row.status === value
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      var sary_path = []
      for (const item in val) {
        sary_path.push(val[item].id)
      }
      this.SelectionArray = sary_path
    },
    usersDelete(ids) {
      MessageBox.confirm('此操作将永久删除该用户，是否继续', '删除用户', { type: 'error' }).then(() => {
        var params = {
          'user_ids': ids
        }
        delUsers(params).then(response => {
          this.getList()
          Message.success('删除成功')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    openUser() {
      this.$confirm('是否启用该用户?', '启用用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.multipleSelection.forEach(
            openclose({
              status: 1,
              identifier: this.multipleSelection[0].id
            }).then(res => {
              this.getList()
              Message.success('启用成功！')
            }).catch((error) => {
              Message.error(error)
            })
          )
        })
        .catch(() => {
          this.messageCance()
        })
    },
    closeUser() {
      this.$confirm('是否停用该用户?', '停用用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.multipleSelection.forEach(
            openclose({
              status: 0,
              identifier: this.multipleSelection[0].id
            }).then(res => {
              this.getList()
              Message.success('停用成功！')
            }).catch((error) => {
              Message.error(error)
            })
          )
          this.messageSuccess()
          this.$refs.multipleTable.clearSelection()
        })
        .catch(() => {
          this.messageCance()
        })
    },
    getUsers() {
      // TODO get users
      console.info('todo get user')
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
    submit() {
      this.$refs['form-user'].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            // todo create user
            this.users.push(this.user)
          } else {
            // todo update user
            Object.assign(this.multipleSelection[0], this.user)
          }
          this.dialogVisible = false
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
