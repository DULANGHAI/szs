<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
     用户管理
    </div>
    <div class="container-body-wrap">
        <template>
        <div class="tabs-nav">
            <div class="tabs-nav-right">
                <el-button  size="small" @click="dialogFormVisible = true">添加用户</el-button>
                  <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                      <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="form.user" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="form.passwd" auto-complete="off">
                        <el-button slot="append" >随机密码</el-button>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="所属业务" :label-width="formLabelWidth">
                        <el-select v-model="value5" multiple placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio v-model="radio" label="male">男</el-radio>
                        <el-radio v-model="radio" label="female">女</el-radio>
                      </el-form-item>
                      <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="form.mail" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="手机" :label-width="formLabelWidth">
                        <el-input v-model="form.phone" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="微信号" :label-width="formLabelWidth">
                        <el-input v-model="form.weixin" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="角色" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择">
                          <el-option label="超级管理员" value="admin"></el-option>
                          <el-option label="普通用户" value="user"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="启用" :label-width="formLabelWidth">
                        <el-switch
                          v-model="value3"
                          active-color="#409EFF"
                          inactive-color="#DCDFE6">
                        </el-switch>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    </div>
                  </el-dialog>

                <el-button size="small" @click="start" >启用</el-button>
                <el-button size="small" @click="stop">停用</el-button>
                <el-button size="small">修改</el-button>
                <el-button size="small" @click="del" >删除</el-button>
            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="用户ID"
            width="100">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
            prop="user"
            label="用户名">
            </el-table-column>
            <el-table-column
            prop="name"
            label="姓名">
            </el-table-column>
            <el-table-column
            prop="edittime"
            label="编辑时间"
            sortable
            width="100">
            </el-table-column>
            <el-table-column
            prop="editperson"
            label="编辑人">
            </el-table-column>
            <el-table-column
            prop="work"
            label="所属业务">
            </el-table-column>
            <el-table-column
            prop="sex"
            label="性别">
            </el-table-column>
            <el-table-column
            prop="mail"
            label="邮箱">
            </el-table-column>
            <el-table-column
            prop="phone"
            label="手机">
            </el-table-column>
            <el-table-column
            prop="weixin"
            label="微信">
            </el-table-column>
            <el-table-column
            prop="users"
            label="角色">
            </el-table-column>
            <el-table-column
            fixed="right"
            prop="status"
            label="状态"
            sortable>
            <template slot-scope="scope">
                <el-button type="text" size="small">启用</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="tabs-nav">
          <div class="tabs-nav-right">
              <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="this.pageSizesArray"
              :page-size="this.pageSize"
              layout="prev, pager, next, sizes, jumper"
              :total="this.totalPage">
              </el-pagination>
          </div>
        </div>
        </template>
    </div>
  </div>
</template>



<script>
import Breadcrumb from '@/components/Breadcrumb'
// import adduser from './adduser' // 新建用户

export default {
  name: 'usermanage',
  components: {
  Breadcrumb,
  },
    data() {
      return {
        tableData3: [{
          date: '01',
          user: 'root',
          name: '侯金刚',
          edittime:'2018-07-26 16:11:00',
          editperson:'朱正华',
          work:'LDDS',
          sex:'男',
          mail:'mail.com',
        }, {
          date: '03',
          user: 'root',
          name: '侯金刚',
          edittime:'2018-07-26 16:13:00',
          editperson:'朱正华',
          work:'LDDS',
          sex:'男',
          mail:'mail.com',
        }],
        listLoading: true,
        is_sltmount: true,
        is_dltmount: true,
        multipleSelection: [],
        SelectionArray: [],
        restaurants: [],
        currentPage: 1, // 当前页面
        pageSizesArray: [10, 20, 30, 40], // 可选每页数量
        pageSizes: '',
        pageSize: 0, // list长度
        totalPage: 0, // list总数
        creator: '',
        timeout: null,
        listData: [],
        // form: JSON.parse(JSON.stringify(formData))
        dialogFormVisible: false,
        form: {
          user:'',
          name: '',
          passwd:'',
          sex:'',
          mail:'',
          phone:'',
          weixin:'',
          users:'',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        options: [{
          value: '选项1',
          label: 'LDDS'
        }, {
          value: '选项2',
          label: '上证云'
        }],
        value5: [],
        value3: true,
      }
    },
    methods: {
      start() {
        this.$confirm('是否启用该用户?', '启用用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '启用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      stop() {
        this.$confirm('是否停用该用户?', '停用用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '停用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      del() {
        this.$confirm('此操作将永久删除该用户?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
  // 随机密码
  function randomPassword(size)
  {
    var seed = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
    'a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z',
    '2','3','4','5','6','7','8','9'
    );//数组
    seedlength = seed.length;//数组长度
    var createPassword = '';
    for (i=0;i<size;i++) {
      j = Math.floor(Math.random()*seedlength);
      createPassword += seed[j];
    }
    return createPassword;
  }
//  passwd=randomPassword(12);
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
