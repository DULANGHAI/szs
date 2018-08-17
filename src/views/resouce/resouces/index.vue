<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      主机组管理
    </div>
    <div class="container-body-wrap review-body">
      <template>
        <!-- 筛选 -->
        <el-row>
          <el-col :span="24">
            <div class="file-nav">
              <div class="file-nav-left"></div>
              <div class="file-nav-right">
                <el-button size="small" >导入主机账号</el-button>
                <el-button size="small" >导入CSV</el-button>
                <el-button size="small" >同步CMBD</el-button>
                <el-button size="small" :disabled="multipleSelection.length !== 1" @click.native="$refs.app.doCreate(false, multipleSelection)">添加主机组</el-button>
                <el-button size="small" :disabled="multipleSelection.length !== 1" @click.native="$refs.app.doCreate(true, multipleSelection)">编辑</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template>
        <tree-table :data.sync="listData" :expandAll="false" :multipleSelection.sync="multipleSelection">
          <el-table-column
            width="100px"
            label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'business'">业务</span>
              <span v-else-if="scope.row.type === 'group'">主机组</span>
              <span v-else>主机</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            width="200px"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="updated_at"
            width="180px"
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="modified_by"
            width="120px"
            label="修改人">
          </el-table-column>
          <el-table-column
            width="100px"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.type === 'group'" type="text">
                <el-tooltip class="item" effect="dark" content="查看主机组" placement="top" style="margin-right:10px;">
                  <i @click.prevent="$refs.see.doCreate(true, scope.row)" class="el-icon-view"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除主机组" placement="top" style="margin-right:10px;">
                  <i @click.prevent="delGroupsDlg(scope.row.id)" class="el-icon-delete"></i>
                </el-tooltip>
              </el-button>
              <el-button v-if="scope.row.type === 'host'" type="text">
                <el-tooltip class="item" effect="dark" content="查看主机组" placement="top" style="margin-right:10px;">
                  <i @click.prevent="$refs.see.doCreate(false, scope.row)" class="el-icon-view"></i>
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </tree-table>
      </template>
    </div>
    <add-host ref="app" v-on:getList="getList"></add-host>
    <see-host ref="see" v-on:getList="getList"></see-host>
  </div>
</template>

<script>
import { getHostList, delGroups } from '@/api/resouce/resouces/host'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message, MessageBox } from 'element-ui'
import TreeTable from './treeTable'
import AddHost from './addHostGroup' // 新建主机组
import SeeHost from './seeHostDlg'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    TreeTable,
    AddHost,
    SeeHost
  },
  data() {
    return {
      multipleSelection: [],
      listLoading: false,
      form: JSON.parse(JSON.stringify(formData)),
      listData: [],
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0 // list总数
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // const params = {
      //   'page': this.currentPage,
      //   'per_page': this.pageSizes || 10
      // }
      this.listLoading = true
      getHostList().then(response => {
        this.listLoading = false
        this.listData = response
      }).catch(error => {
        Message.error(error)
      })
    },
    // 删除文件
    delGroupsDlg(id) {
      MessageBox.confirm('此操作将永久删除该主机组，是否继续', '删除风主机组', { type: 'error' }).then(() => {
        delGroups(id).then(response => {
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
