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
                
              </div>
              <div class="file-nav-right">
                <el-button size="small" >导入主机账号</el-button>
                <el-button size="small" >导入CSV</el-button>
                <el-button size="small" >同步CMBD</el-button>
                <el-button size="small" >添加主机组</el-button>
                <el-button size="small" >编辑</el-button>
                <el-button size="small" >查看</el-button>
                <el-button size="small" >删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template>
        <el-table
          ref="multipleTable"
          :data="listData"
          tooltip-effect="dark"
          style="width: 100%"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column v-if="columns.length===0" width="150">
            <template slot-scope="scope">
              <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.$index}}
            </template>
          </el-table-column>
          <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
            <template slot-scope="scope">
              <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.row[column.value]}}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="list-paging">
        <el-pagination
          v-if="this.totalPage > 0"
          background
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
  </div>
</template>

<script>
import { getApplicationList } from '@/api/resouce/applications/application'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'
import treeToArray from './eval'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      data: {
        type: [Array, Object],
        required: true
      },
      columns: {
        type: Array,
        default: () => []
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      },
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
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  created() {
    console.log(99)
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    handleSelectionChange(val) {
      console.log(val)
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
