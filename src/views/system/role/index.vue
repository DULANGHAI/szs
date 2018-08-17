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
        <el-button size="small" @click.native="removeRole" :disabled="!selected">删除角色</el-button>
        <el-button size="small" @click.native="editRole" :disabled="!selectedOne">重命名</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="roles"
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
            <el-button type="text" @click="editPermission">编辑权限</el-button>
            <el-button type="text" @click="check">查看权限</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%">
      <el-form v-show="dialogRole" ref="form-role" :model="role" :rules="rulesRole" label-width="80px" size="small">
        <el-form-item label="用户名" prop="remark">
          <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="rolename">
          <el-input v-model="role.rolename" auto-complete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="role.passward"></el-input>
        </el-form-item>
        
      </el-form>
      <el-form v-show="dialogPermission" ref="form-permission" :model="permission" :rules="rulesPermission" label-width="80px" size="small">
        <el-form-item label="选择权限" prop="roles">
          <el-select v-model="value" multiple placeholder="请选择" :style="{width: '100%'}">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-show="dialogRole" type="primary" @click="submit('form-role')">确 定</el-button>
        <el-button v-show="dialogPermission" type="primary" @click="submit('form-permission')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'
// import {getAdduserApi} from '@/api/pe/systemManage/system.js'
import { getAdduserApi, deleteAdduserApi, getAlluserApi, getrolesId, createdrolesId, deleterolesId } from '@/api/systemManage/system.js'
import { getToken } from '@/utils/auth'
import { getpermissions } from '@/api/systemManage/system.js'

//  import {createUserApi,deleteUserApi,queryUserApi,updateidUserApi,deleteidUserApi,getidUserApi,updatepassUserApi,jumppassUserApi,getAdduserApi,deleteAdduserApi,getAlluserApi} from '@/api/pe/systemManage/system.js'

const defaultRole = {
  rolename: '',
  remark: ''
}

export default {
  mixins: [common],
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 表单状态
      id1: [],
      rolesid: '',
      id: '', // 传给后端的user_id
      tableLoading: true,
      currentPage: 1,
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 0,
      totalPage: 0,
      multipleSelection: [],
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
      options: [
        // {
        //   value: '选项1',
        //   label: '选项1'
        // },
        // {
        //   value: '选项2',
        //   label: '选项2'
        // },
        // {
        //   value: '选项3',
        //   label: '选项3'
        // },
        // {
        //   value: '选项4',
        //   label: '选项4'
        // },
        // {
        //   value: '选项5',
        //   label: '选项5'
        // }
      ],
      value: ''
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
      return this.roles.filter(item => {
        return !~this.multipleSelection.indexOf(item)
      })
    },
    dialogTitle() {
      switch (this.dialogType) {
        case 'roleEdit':
          return '编辑角色'
        case 'roleCreate':
          return '添加角色'
        case 'permissionEdit':
          return '编辑权限'
      }
    },
    dialogRole() {
      return this.dialogType === 'roleCreate' || this.dialogType === 'roleEdit'
    },
    dialogPermission() {
      return this.dialogType === 'permissionEdit'
    }
  },
  watch: {
    dialogVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs['form-role'].clearValidate()
          this.$refs['form-permission'].clearValidate()
        })
      }
    }
  },
  mounted() {
    getrolesId().then(res => {
      this.roles = res
      this.totalPage = res.length
      // console.log(res)
    }).catch(() => {

    })

    //   getAlluserApi({
    //     // role_ids:'1,2,3',
    //     user_id:this.id
    //   }).then(res=>{
    //     this.roles=res,
    //     this.totalPage=res.length
    //     console.log(res,'1')
    //   }).catch(error=>{
    //     console.log('2')
    //   })
    // console.log(this.id)
    // getAdduserApi({

    //   role_ids:'1,2,3',
    //   user_id:this.id
    // }).then(res=>{
    //   console.log(res,'1')
    // }).catch(error=>{
    //   console.log('2')
    // })
    // getAlluserApi({
    //   user_id:1
    // }).then(res=>{

    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
  },
  created() {
    this.id = getToken()
    // getAlluserApi({
    //   user_id:1
    // }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // deleteAdduserApi({
    //   role_ids:'1',
    //   user_id:1,
    //   role_id:'1'
    // }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // updatepassUserApi({
    //   new_pwd:'111111Saa!',
    //   password:'Spf11111!',
    //   verify_pwd:'111111Saa!',
    //   user_id  :'5'
    // }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // getidUserApi({
    //  identifier :3
    //   }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // deleteidUserApi({
    //  identifier :3
    //   }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // updateidUserApi({
    //   username:'1',
    //   status:1,
    //   role_ids:[2],
    //   modified_by:'1',
    //   realname:'1',
    //   business:'1',
    //   telephone:'1',
    //   wechat:'1',
    //   password:'1',
    //   email:'1',
    //   identifier:3
    // }).then(res=>{
    //   console.log(res,1)
    // }).catch(res=>{
    //   console.log(2)
    // })
    // queryUserApi({
    //   page:1,
    //   per_page:2,

    //   status:'1',

    // }).then(res=>{
    //   console.log('1')
    // }).catch(res=>{
    //   console.log('2')
    // })
    // createUserApi({
    //   username:'1',
    //   status:0,
    //   role_ids:[3],
    //   modified_by:'1',
    //   realname:'1',
    //   business:'31',
    //   telephone:'31',
    //   wechat:'31',
    //   password:'Spf11111!',
    //   email:'11321@qq.com'
    // }).then(res=>{
    //   console.log(res)
    // }).catch(res=>{
    //   console.log('2')
    // }),

    // getAdduserApi({role_ids:'3',user_id:1,role_id:3}).then(res => {
    //     console.log(res,1)
    //   }).catch(res=>{
    //     console.log('2')
    //   }),

    this.tableLoading = false
    this.roles = [
      // {
      //   id: '1',
      //   rolename: 'rn1',
      //   remark: 'rm1',
      //   created_at: '2018-07-25T04:31:00.499Z',
      //   created_by: 'string',
      //   sex: 'man',
      //   role: [
      //     'a',
      //     'b',
      //     'c'
      //   ]
      // },
      // {
      //   id: '2',
      //   rolename: 'rn2',
      //   remark: 'rm2',
      //   created_at: '2018-07-25T04:31:00.499Z',
      //   created_by: 'string',
      //   sex: 'female',
      //   role: [
      //     'a',
      //     'b',
      //     'c'
      //   ]
      // }
    ]
    this.currentPage = 1
    // this.totalPage = 2
  },

  methods: {

    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    editRole() {
      this.role = { ...this.multipleSelection[0] }
      this.dialogType = 'roleEdit'
      this.dialogVisible = true
    },
    createRole() {
      this.role = { ...defaultRole }
      this.dialogType = 'roleCreate'
      this.dialogVisible = true
    },
    check() {
      // getonepermissions({
      //   permission_ids:'',
      //   permission_id:'',
      //   role_id:''
      // })
      this.$router.push({ path: '/system/dashboard/role/list' })
    },
    editPermission() {
      getpermissions().then(res => {
        this.options = res
        console.log(res, '1')
      }).catch(() => {

      })
      this.dialogType = 'permissionEdit'
      this.dialogVisible = true
    },
    removeRole() {
      this
        .$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          // 删除角色
          // deleterolesId({
          //   identifier:this.id1[0]
          // }).then(res=>{

          // })
          this.users = this.multipleSelectionFilter
          this.messageSuccess()
          this.$refs.multipleTable.clearSelection()
        })
        .catch(() => {
          this.messageCancel()
        })
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
    submit(fromName) {
      this.$refs[fromName].validate((valid) => {
        console.log(this.rolesid)

        if (valid) {
          // console.log(this.id,'2222')
          // console.log('submit', fromName)
          getrolesId().then(res => {
            this.roles = res
            this.totalPage = res.length
            for (let i = 0; i < res.length; i++) {
              this.id1.push(res[i].id)
            }
            console.log(this.id1)
            // this.id1=res.
            // console.log(res)
          }).catch(() => {
          })

          createdrolesId({
            created_user: this.role.rolename,
            name: this.role.name,
            description: this.role.passward
          }).then(res => {

            // console.log(res,'1')
          }).catch(() => {
            // console.log('2')
          })
          // deleterolesId().then(res=>{
          //   identifier:
          // }).catch(res=>{

          // })
          this.messageSuccess()
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
