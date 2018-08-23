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
                <el-input placeholder="可搜索组名或ip地址" size="small" v-model="searchContent" @change="search">
                  <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                  </i>
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
                <el-button size="small" @click.native="onCMDB">同步CMBD</el-button>
                <el-button size="small" :disabled="multipleSelection.length !== 1" @click.native="dappAdd">添加主机组</el-button>
                <el-button size="small" :disabled="multipleSelection.length !== 1" @click.native="dappEdit">编辑</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template>
        <tree-table :data.sync="nodeList" :loading="listLoading" :expandAll="false" :multipleSelection.sync="multipleSelection" :searchText="searchText">
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
              <el-tooltip v-if="scope.row.type === 'group'" class="item" effect="dark" content="查看主机组" placement="top" style="margin-right:10px;">
                <el-button type="text"><i @click.prevent="$refs.see.doCreate(true, scope.row)" class="el-icon-view"></i></el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.type === 'group'" class="item" effect="dark" content="删除主机组" placement="top" style="margin-right:10px;">
                <el-button type="text"><i @click.prevent="delGroupsDlg(scope.row.id)" class="el-icon-delete"></i></el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.type === 'host'" class="item" effect="dark" content="查看主机" placement="top" style="margin-right:10px;">
                <el-button type="text"><i @click.prevent="$refs.see.doCreate(false, scope.row)" class="el-icon-view"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </tree-table>
      </template>
    </div>
    <add-host ref="app" v-on:getList="getList"></add-host>
    <edit-host ref="edit" v-on:getList="getList"></edit-host>
    <see-host ref="see" v-on:getList="getList"></see-host>
  </div>
</template>

<script>
import { getHostList, delGroups, postCMDB } from '@/api/resouce/resouces/host'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message, MessageBox } from 'element-ui'
import TreeTable from './treeTable'
import AddHost from './addHostGroup' // 新建主机组
import editHost from './editHost' // 编辑主机
import SeeHost from './seeHostDlg'
import _ from 'lodash'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    TreeTable,
    AddHost,
    SeeHost,
    editHost
  },
  data() {
    return {
      multipleSelection: [],
      listLoading: true,
      form: JSON.parse(JSON.stringify(formData)),
      nodeList: [],
      searchText: '',
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
  methods: {
    // 对子节点进行搜索。
    searchEach(node, value) {
      var depth = this.getTreeDepth(node)
      var self = this
      for (var i = 0; i < depth - 1; i++) {
        // 记录【删除不匹配搜索内容的叶子节点】操作的次数。
        // 如果这个变量记录的操作次数为0，表示树形结构中，所有的
        // 叶子节点(不包含只有根节点的情况)都匹配搜索内容。那么就没有必要再
        // 在循环体里面遍历树了.
        var spliceCounter = 0

        // 遍历树形结构
        this.traverseTree(node, (n) => {
          if (self.isHasChildren(n)) {
            var children = n.children
            var length = children.length

            // 找到不匹配搜索内容的叶子节点并删除。为了避免要删除的元素在数组中的索引改变，从后向前循环,
            // 找到匹配的元素就删除。
            for (var j = length - 1; j >= 0; j--) {
              var e3 = children[j]
              if (!self.isHasChildren(e3) && e3.name.indexOf(value) <= -1) {
                children.splice(j, 1)
                spliceCounter++
              }
            } // end for (let j = length - 1; j >= 0; j--)
          }
        }) // end this.traverseTree(node, n=>{

        // 所有的叶子节点都匹配搜索内容，没必要再执行循环体了。
        if (spliceCounter === 0) {
          break
        }
      }
    },
    // 搜索框回车事件响应
    search() {
      var self = this
      // 把树形结构还原成搜索以前的。
      var cda = _.cloneDeep(this.listData)
      this.nodeList = cda
      if (this.searchContent === '') {
        this.searchText = ''
        return
      }
      if (this.nodeList && this.nodeList.length > 0) {
        this.nodeList.forEach((n, i, a) => {
          self.searchEach(n, this.searchContent)
        })

        // 没有叶子节点的根节点也要清理掉
        var length = this.nodeList.length
        for (var i = length - 1; i >= 0; i--) {
          var e2 = this.nodeList[i]
          if (!this.isHasChildren(e2) && e2.name.indexOf(this.searchContent) <= -1) {
            this.nodeList.splice(i, 1)
          }
        }
        this.searchText = this.searchContent
      }
    },
    // 判断树形结构中的一个节点是否具有孩子节点
    isHasChildren(node) {
      var flag = false
      if (node.children && node.children.length > 0) {
        flag = true
      }
      return flag
    },
    // 通过传入根节点获得树的深度，是 calDepth 的调用者。
    getTreeDepth(node) {
      if (undefined === node || node === null) {
        return 0
      }
      // 返回结果
      let r = 0
      // 树中当前层节点的集合。
      let currentLevelNodes = [node]
      // 判断当前层是否有节点
      while (currentLevelNodes.length > 0) {
        // 当前层有节点，深度可以加一。
        r++
        // 下一层节点的集合。
        let nextLevelNodes = []
        // 找到树中所有的下一层节点，并把这些节点放到 nextLevelNodes 中。
        for (let i = 0; i < currentLevelNodes.length; i++) {
          var e = currentLevelNodes[i]
          if (this.isHasChildren(e)) {
            nextLevelNodes = nextLevelNodes.concat(e.children)
          }
        }
        // 令当前层节点集合的引用指向下一层节点的集合。
        currentLevelNodes = nextLevelNodes
      }
      return r
    },
    // 非递归遍历树
    traverseTree(node, callback) {
      if (!node) {
        return
      }
      var stack = []
      stack.push(node)
      var tmpNode
      while (stack.length > 0) {
        tmpNode = stack.pop()
        callback(tmpNode)
        if (tmpNode.children && tmpNode.children.length > 0) {
          for (let i = tmpNode.children.length - 1; i >= 0; i--) {
            stack.push(tmpNode.children[i])
          }
        }
      }
    },
    dappAdd() {
      if (this.multipleSelection[0].type === 'host') {
        Message.error('主机下不能添加主机组')
      } else {
        this.$refs.app.doCreate(false, this.multipleSelection)
      }
    },
    dappEdit() {
      if (this.multipleSelection[0].type === 'business') {
        Message.error('只有主机组和主机可以编辑')
      } else if (this.multipleSelection[0].type === 'host') {
        this.$refs.edit.doCreate(true, this.multipleSelection)
      } else {
        this.$refs.app.doCreate(true, this.multipleSelection)
      }
    },
    getList() {
      this.listLoading = true
      getHostList().then(response => {
        this.listLoading = false
        this.nodeList = response
        this.listData = response
      }).catch(error => {
        Message.error(error)
      })
    },
    onCMDB() {
      postCMDB().then(response => {
        this.getList()
        Message.success('同步成功！')
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
      Message.success('上传成功')
    },
    // 上传错误
    uploadError(response, file, fileList) {
      Message.error('上传失败，请重试！')
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
