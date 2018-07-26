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
        <el-form>
            <el-row :gutter="20">
                <el-col :span="10" :offset="10">
                    <div class="grid-content bg-purple">
                        <el-button size="small">添加用户</el-button>
                        <el-button size="small">启用</el-button>
                        <el-button size="small">停用</el-button>
                        <el-button size="small">修改</el-button>
                        <el-button size="small">删除</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
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
            label="用户名"
            width="120">
            </el-table-column>
            <el-table-column
            prop="name"
            label="姓名"
            width="120">
            </el-table-column>
            <el-table-column
            prop="edittime"
            label="编辑时间"
            width="200">
            </el-table-column>
            <el-table-column
            prop="editperson"
            label="编辑人"
            width="120">
            </el-table-column>
            <el-table-column
            prop="work"
            label="所属业务"
            width="120">
            </el-table-column>
            <el-table-column
            prop="sex"
            label="性别"
            width="50">
            </el-table-column>
            <el-table-column
            prop="mail"
            label="邮箱"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            fixed="right"
            prop="status"
            label="状态"
            width="120">
            <template slot-scope="scope">
                <el-button type="text" size="small">启用</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
        </template>


    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'user',
  components: {
    Breadcrumb
  },
    data() {
      return {
        tableData3: [{
          date: '03',
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
          edittime:'2018-07-26 16:11:00',
          editperson:'朱正华',
          work:'LDDS',
          sex:'男',
          mail:'mail.com',
        }, {
          date: '03',
          user: 'root',
          name: '侯金刚',
          edittime:'2018-07-26 16:11:00',
          editperson:'朱正华',
          work:'LDDS',
          sex:'男',
          mail:'mail.com',
        }],
        multipleSelection: []
      }
    },

    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
