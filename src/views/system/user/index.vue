<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      用户管理
    </div>
    <!-- 列表 -->
    <div class="container-body-wrap">
      <el-row class="table-buttons">
        <el-button size="small" @click.native="createUser">添加用户</el-button>
        <el-button size="small" @click.native="openUser" :disabled="!selected">启用</el-button>
        <el-button size="small" @click.native="closeUser" :disabled="!selected">停用</el-button>
        <el-button size="small" @click.native="editUser" :disabled="!selectedOne">修改</el-button>
        <el-button size="small" @click.native="removeUser" :disabled="!selected">删除</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="usersLoading"
        :data="users"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="用户ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime" width="160"></el-table-column>
        <el-table-column prop="realname" label="联系人"> </el-table-column>
        <el-table-column prop="business" label="所属业务"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="telephone" label="手机"></el-table-column>
        <el-table-column prop="realname" label="角色"></el-table-column>
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
    <!-- 弹窗 -->
    <el-dialog :title="!isEdit ? '添加用户' : '编辑用户'" :visible.sync="dialogVisible" width="35%" top="5%">
      <el-form ref="form-user" :model="user" :rules="rules" label-width="80px" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passward">
          <el-input v-model="user.passward">
            <template slot="append"><el-button>随机生成</el-button></template>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="user.realname"></el-input>
        </el-form-item>
        <el-form-item label="所属业务" prop="business">
          <el-select v-model="user.business" :style="{width: '100%'}" multiple placeholder="请选择">
            <el-option
              v-for="item in businessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="user.telephone"></el-input>
        </el-form-item>
        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="user.wechat"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="user.role" :style="{width: '100%'}" placeholder="请选择">
            <el-option
              v-for="item in businessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用" prop="status">
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
import { getAdduserApi, deleteAdduserApi, getAlluserApi, getrolesId ,openclose, deleteuser} from '@/api/systemManage/system.js'
import { getToken } from '@/utils/auth'
import { queryUserApi } from '@/api/systemManage/system.js'

const defaultUserForm = {
  username: '',
  status: 0,
  realname: '',
  business: '',
  sex: '',
  id: 0,
  telephone: '',
  password: '',
  email: ''
}

export default {
  mixins: [common],
  components: {
    Breadcrumb
  },
  data() {
    return {
      usersLoading: true,
      currentPage: 1, // 当前页码
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 5,
      totalPage: 0, // 页面中的项目数
      multipleSelection: [],
      // 用户数据
      users: [],
      user: {
        username: 'string',
        status: 0,
        realname: 'string',
        business: 'string',
        created_at: '2018-07-25T04:31:00.499Z',
        updated_at: '2018-07-25T04:31:00.499Z',
        sex: 'string',
        id: 0,
        telephone: 'string',
        password: 'string',
        email: 'string',
        modifier_name: 'string'
      },
      // 弹出框
      dialogVisible: false,
      isEdit: false,
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        realname: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        passward: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      },
      businessOptions: [
        {
          label: 'LDDS',
          value: 'LDDS'
        },
        {
          label: '1111',
          value: '1111'
        },
        {
          label: '2222',
          value: '2222'
        },
        {
          label: '3333',
          value: '3333'
        }
      ],
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
  mounted() {
    queryUserApi({
      page: this.currentPage,
      per_page: this.totalPage
    })
      .then(res => {
        this.totalPage = res.per_page
        this.currentPage = res.page
        this.users = res.items
        // console.log(res,'1')
        console.log(res.per_page, '1')
      })
      .catch(error => {
        // console.log('2')
        console.error(error)
      })
  },
  created() {
    // submitForm()
    // createUserApi()
    // console.log(this.$route.query.res, 1);
    this.usersLoading = false
    this.users = []
    this.currentPage = 1
    this.pageSize = 20
    this.totalPage = 55
  },
  methods: {
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    filterStatusMethod(value, row) {
      return row.status === value
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    editUser() {
      this.user = { ...this.multipleSelection[0] }
      this.isEdit = true
      this.dialogVisible = true
    },
    createUser() {
      this.user = { ...defaultUserForm }
      this.dialogVisible = true
    },
    removeUser() {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          deleteuser({
            identifier:this.multipleSelection[0].id
          }).then(res=>{
            console.log(res)
          })
          this.users = this.multipleSelectionFilter
          this.messageSuccess()
          this.$refs.multipleTable.clearSelection()
        })
        .catch(() => {
          this.messageCance()
        })
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
            status:1,
            identifier:this.multipleSelection[0].id
          }).then(res=>{
            console.log(res)
            // item.status = res.status
          }).catch(error=>{
            console.log('22')
          })
            // item => {
            // item.status = 1
          // }
          )
          this.messageSuccess()
          this.$refs.multipleTable.clearSelection()
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
            status:0,
            identifier:this.multipleSelection[0].id
          }).then(res=>{
            console.log('333')
          })
            // item => {
            // item.status = 0
          // }
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
      this.pageSize = val
      this.getUsers()
    },
    // 选择当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsers()
    },
    submit() {
      this.$refs['form-user'].validate(valid => {
        // openclose({
        //   identifier:this.multipleSelection[0].id
        // }).then(res=>{
        // this.totalPage = res.per_page
        // this.currentPage = res.page
        // this.users = res.items
          // console.log(res,'修改成功')
        // })
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
