<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
     角色管理
    </div>
    <div class="container-body-wrap">
        <template>
        <div class="tabs-nav">
            <div class="tabs-nav-right">
                <el-button size="small" @click="dialogFormVisible = true">添加角色</el-button>
                    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="角色" :label-width="formLabelWidth">
                                 <el-input v-model="form.user" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" :label-width="formLabelWidth">
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入备注"
                                    v-model="form.textarea">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>

                <el-button size="small" @click="del" >删除角色</el-button>

                <el-button size="small" @click="rename">重命名</el-button>
                    <el-dialog title="添加角色" :visible.sync="rename">
                        <el-form :model="form">
                            <el-form-item label="角色" :label-width="formLabelWidth">
                                 <el-input v-model="form.user" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" :label-width="formLabelWidth">
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入备注"
                                    v-model="form.textarea">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="rename = false">取 消</el-button>
                            <el-button type="primary" @click="rename = false">确 定</el-button>
                        </div>
                    </el-dialog>
            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="角色ID"
            width="100">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
            prop="user"
            label="用户名">
            </el-table-column>
            <el-table-column
            prop="note"
            label="备注">
            </el-table-column>
            <el-table-column
            prop="createtime"
            label="创建时间"
            sortable>
            </el-table-column>
            <el-table-column
            prop="createperson"
            label="创建人">
            </el-table-column>
            <el-table-column
            fixed="right"
            prop="status"
            label="操作"
            sortable>
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="Edit_permissions">编辑权限</el-button>
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

export default {
    name: 'rolermanage',
    components: {
    Breadcrumb,
    },

    data(){
        return{
            tableData:[{
                date: '01',
                user:'超级管理员',
                note:'一段描述',
                createtime:'2018-8-2 15:27:00',
                createperson:'侯金刚',
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

            dialogFormVisible: false,
            form:{
                user:'',
                textarea: '',
            },
        }
    },
    methods:{
      del() {
        this.$confirm('此操作将永久删除该角色?', '删除角色', {
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
      },
    }
}
</script>
