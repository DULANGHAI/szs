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
                <el-button size="small" @click.native="$refs.app.doCreate(false)">添加主机组</el-button>
                <el-button size="small" >编辑</el-button>
                <el-button size="small" >查看</el-button>
                <el-button size="small" >删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template>
        <tree-table :data.sync="listData" :expandAll="false" :multipleSelection.sync="multipleSelection">
          <el-table-column
            label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'business'">业务</span>
              <span v-else-if="scope.row.type === 'group'">主机组</span>
              <span v-else>主机</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="updated_at"
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="modified_by"
            label="修改人">
          </el-table-column>
        </tree-table>
      </template>
    </div>
    <add-host ref="app" v-on:getList="getList"></add-host>
  </div>
</template>

<script>
import { getHostList } from '@/api/resouce/resouces/host'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'
import TreeTable from './treeTable'
import AddHost from './addHostZu' // 新建风险命令

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    TreeTable,
    AddHost
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
      // getRiskList(params).then(response => {
      //   this.listData = [
      //     {
      //       comment: 'sfdsfdsf',
      //       risk_level: 2,
      //       name: 'abvvvvv',
      //       creator: 'od',
      //       created_at: '2018-07-24T10:48:11',
      //       updated_at: '2018-07-27T17:27:38',
      //       id: 3,
      //       children: [{
      //         comment: 'sfdsfdsf',
      //         risk_level: 2,
      //         name: 'abvvvvv',
      //         creator: 'od',
      //         created_at: '2018-07-24T10:48:11',
      //         updated_at: '2018-07-27T17:27:38',
      //         id: 3
      //       }]
      //     },
      //     {
      //       comment: 'this is test',
      //       risk_level: 1,
      //       name: 'cat',
      //       creator: 'god',
      //       created_at: '2018-07-24T10:31:35',
      //       updated_at: '2018-07-24T10:31:35',
      //       id: 1
      //     }
      //   ]
      //   this.listLoading = false
      //   this.totalPage = response.total
      // }).catch(error => {
      //   Message.error(error)
      // })
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
