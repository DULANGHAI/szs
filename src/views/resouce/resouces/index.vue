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
              <div class="file-nav-left">
                <el-input placeholder="可搜索组名或ip地址" size="small" v-model="searchContent">
                  <el-button slot="append" icon="el-icon-search" @click="datafilter"></el-button>
                </el-input>
              </div>
              <div class="file-nav-right">
                <span class="hostuploadpanel" style="display:inline-block">
                  <el-upload
                    class="upload-demo"
                    :onSuccess="uploadSuccess"
                    :onError="uploadError"
                    :action="uploadHost()"
                    :show-file-list="false"
                    :limit="1">
                    <el-button size="small" >导入主机账号</el-button>
                  </el-upload>
                </span>
                <span class="hostuploadpanel" style="display:inline-block">
                  <el-upload
                    class="upload-demo"
                    :onSuccess="uploadSuccess"
                    :onError="uploadError"
                    :action="uploadCSV()"
                    :show-file-list="false"
                    :limit="1">
                    <el-button size="small" >导入CSV</el-button>
                  </el-upload>
                </span>
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
      tableDataClone: [],
      filtervalue: '',
      searchContent: '',
      searchColumn: 'name',
      currentPage: 1, // 当前页面
      pageSizesArray: [10, 20, 30, 40], // 可选每页数量
      pageSizes: '',
      pageSize: 0, // list长度
      totalPage: 0 // list总数,
    }
  },
  created() {
    this.getList()
  },
  watch: {
    // 因父组件表格数据通常存在异步操作
    // 需监听props以得到正确的数据
    listData(newTableData) {
      if (newTableData.length > 0 && this.tableDataClone.length === 0) {
        this.tableDataClone = newTableData
      }
    }
  },
  filters: {
    listData: function(val) {
      // const searchRegex = new RegExp(this.filtervalue, 'i')
      console.log(val)
    }
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
    // 导入csv
    uploadCSV() {
      return '/v1/hosts/infos'
    },
    // 导入主机账号
    uploadHost() {
      return '/v1/hosts/accounts'
    },
    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      this.getList()
      Message.succes('上传成功')
    },
    // 上传错误
    uploadError(response, file, fileList) {
      Message.error('上传失败，请重试！')
    },
    // 表格搜索函数，可支持多列搜索
    search(data, argumentObj) {
      // data = data || this.data
      // // console.log(filter)
      // for (const node of data) {
      //   // console.log(node.indexOf(filter))
      //   var searched = data.filter(d => {
      //     return d[node].indexOf(filter[data]) > -1
      //   })
      //   // this.$set(node, 'searched', searched)
      //   // this.$set(node, 'visible', false)
      //   // this.$emit('toggleshow', node, filter ? searched : true)
      //   if (node.children && node.children.length) {
      //     if (searched) this.$set(node, 'expanded', true)
      //     this.search(filter, node.children)
      //   }
      // }

      var res = data
      var dataClone = data
      // var argumentObjStr = '{"' + this.searchColumn + '": "' + this.searchContent + '"}'
      for (var argu in argumentObj) {
        if (argumentObj[argu].length > 0) {
          // if (argu.children.length > 0) {
          //   this.search(argu.children, JSON.parse(argumentObjStr))
          // }
          res = dataClone.filter(d => {
            return d[argu].indexOf(argumentObj[argu]) > -1
          })
          dataClone = res
        }
      }
      return res
    },
    // 数据过滤
    datafilter() {
      var argumentObjStr = '{"' + this.searchColumn + '": "' + this.searchContent + '"}' // 拼接json
      console.log(argumentObjStr)
      var argumentObj = JSON.parse(argumentObjStr) // 转为对象
      var res = this.search(this.tableDataClone, argumentObj) // 执行搜索，获取搜索结果
      this.listData = res
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
  .hostuploadpanel {
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
  }
  .hostuploadpanel ul{
    display: none !important;
  }
</style>
