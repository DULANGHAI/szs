<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      命令白名单
    </div>
    <div class="container-body-wrap risk-body">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="10">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="form.datatime"
                  type="daterange"
                  style="width:100%"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="创建人">
                <el-autocomplete
                  v-model="form.creator"
                  :fetch-suggestions="creatorAutoSearch"
                  placeholder="请输入创建人"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="命令">
                <el-autocomplete
                  v-model="form.name"
                  :fetch-suggestions="nameAutoSearch"
                  placeholder="请输入命令"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:right">
              <el-button size="small" type="primary" @click.native="getList">查询</el-button>
              <el-button size="small" @click.native="searchReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="file-nav">
          <div class="file-nav-right">
            <el-button size="small" @click.native="$refs.app.doCreate(false)">添加命令白名单</el-button>
            <el-button size="small" :disabled="is_sltmount" @click.native="$refs.app.doCreate(true, multipleSelection[0])">编辑</el-button>
            <el-button size="small" :disabled="is_dltmount" @click.native="FileDelete(SelectionArray)">删除</el-button>
          </div>
        </div>
      </template>
      <template>
        <el-table
          ref="multipleTable"
          :data="listData"
          tooltip-effect="dark"
          style="width: 100%"
          empty-text="暂无数据"
          v-loading.body="listLoading"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="created_at"
            :formatter="formatterTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="name"
            label="命令">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人">
          </el-table-column>
        </el-table>
      </template>
      <div class="list-paging">
        <el-pagination
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
    <add-risk ref="app" v-on:getList="getList"></add-risk>
  </div>
</template>

<script>
import { getWhiteList, deleteWhite, searchWhite } from '@/api/resouce/versionLibrary/whitelist'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message, MessageBox } from 'element-ui'
import AddRisk from './addWhiteList' // 新建风险命令

const formData = {
  'name': '',
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    AddRisk
  },
  data() {
    return {
      levelOptions: [{
        label: '低危',
        value: 1
      }, {
        label: '中危',
        value: 2
      }, {
        label: '高危',
        value: 3
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
      form: JSON.parse(JSON.stringify(formData))
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      var sary_path = []
      for (const item in val) {
        sary_path.push(val[item].id)
      }
      this.SelectionArray = sary_path
      val.length > 0 ? this.is_dltmount = false : this.is_dltmount = true
      val.length > 0 && val.length < 2 ? this.is_sltmount = false : this.is_sltmount = true
    },
    getList() {
      const params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10,
        'end_time': this.form.datatime && this.form.datatime[1] || null,
        'start_time': this.form.datatime && this.form.datatime[0] || null,
        'name': this.form.name,
        'creator': this.form.creator
      }
      this.listLoading = true
      getWhiteList(params).then(response => {
        this.listData = response.items
        this.listLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
    },
    searchReset() {
      this.form = JSON.parse(JSON.stringify(formData))
      this.getList()
    },
    // 删除文件
    FileDelete(id) {
      MessageBox.confirm('此操作将永久删除该命令，是否继续', '删除命令白名单', { type: 'error' }).then(() => {
        deleteWhite(id).then(response => {
          this.getList()
          Message.success('删除成功')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    creatorAutoSearch(queryString, cb) {
      const params = {
        'creator': queryString
      }
      var list = []
      searchWhite(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.creator
          })
        }
        cb(this.unique(list))
      }).catch(error => {
        Message.error(error)
      })
    },
    nameAutoSearch(queryString, cb) {
      const params = {
        'name': queryString
      }
      var list = []
      searchWhite(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.name
          })
        }
        cb(this.unique(list))
      }).catch(error => {
        Message.error(error)
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
