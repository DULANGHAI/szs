<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      应用列表
    </div>
    <div class="container-body-wrap review-body">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="6">
              <el-form-item label="实例名">
                <el-autocomplete
                  v-model="form.instance_name"
                  :fetch-suggestions="slmSearch"
                  placeholder="请输入实例名"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应用类型">
                <el-autocomplete
                  v-model="form.type"
                  :fetch-suggestions="typeSearch"
                  placeholder="请输入应用类型"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应用">
                <el-autocomplete
                  v-model="form.name"
                  :fetch-suggestions="nameSearch"
                  placeholder="请输入实例名"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="版本">
                <el-autocomplete
                  v-model="form.verion"
                  :fetch-suggestions="versionSearch"
                  placeholder="请输入版本"
                ></el-autocomplete>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="创建人">
                <el-autocomplete
                  v-model="form.creator"
                  :fetch-suggestions="creatorSearch"
                  placeholder="请输入创建人"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发布人">
                <el-autocomplete
                  v-model="form.publisher"
                  :fetch-suggestions="fbrSearch"
                  placeholder="请输入发布人"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-input v-model="form.instance_status" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提交时间">
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
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="file-nav">
                <div class="file-nav-left">
                  <el-button size="small" @click="goCreate()">添加应用实例</el-button>
                  <el-button size="small" @click.native="viewDetail()" :disabled="is_sltmount" >查看</el-button>
                  <el-button size="small" @click.native="FileEdit(SelectionArray)" :disabled="is_sltmount" >编辑</el-button>
                  <el-button size="small" @click.native="FileDelete(SelectionArray)" :disabled="is_dltmount">删除</el-button>
                </div>
                <div class="file-nav-right">
                  <el-button size="small" type="primary" @click.native="getList">查询</el-button>
                  <el-button size="small" @click.native="searchReset">重置</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template>
        <el-table
          ref="multipleTable"
          :data="listData"
          tooltip-effect="dark"
          empty-text="暂无数据"
          v-loading.body="listLoading"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="instance_name"
            label="实例名">
          </el-table-column>
          <el-table-column
            prop="instance_description"
            width="160"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="name"
            label="应用">
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本">
          </el-table-column>
          <el-table-column
            prop="creator"
            width="100"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="updated_at"
            :formatter="formatterTime"
            width="160"
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="publisher"
            label="发布人">
          </el-table-column>
          <el-table-column
            prop="publish_time"
            :formatter="formatterTime"
            width="160"
            label="发布时间">
          </el-table-column>
          <el-table-column
            prop="type"
            show-overflow-tooltip
            label="应用类型">
          </el-table-column>
          <el-table-column
            prop="sw_package_repository"
            width="150"
            show-overflow-tooltip
            label="软件包库">
          </el-table-column>
          <el-table-column
            prop="cfg_file_repository"
            label="配置文件库"
            show-overflow-tooltip
            width="150"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="状态"
            fixed="right">
            <template slot-scope="scope">
              <span v-if="scope.row.instance_status === 1">新建</span>
              <span v-else-if="scope.row.instance_status === 2" style="color:#FAAD14">已修改</span>
              <span v-else-if="scope.row.instance_status === 3" style="color:#52C41A">已发布</span>
              <span v-else-if="scope.row.instance_status === 4" style="color:#F5222D">已下线</span>
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
    <add-view ref="app" v-on:getList="getList"></add-view>
  </div>
</template>

<script>
import { getApplicationList, getApplicationSearch, deleteApp } from '@/api/resouce/applications/application'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message, MessageBox } from 'element-ui'
import AddView from './appView'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel,
    AddView
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      multipleSelection: [],
      SelectionArray: [],
      is_dltmount: true,
      is_sltmount: true,
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
    // 跳转到详情页
    goDetail(val) {
      this.$router.push({
        name: 'reviewDetail',
        params: {
          id: val
        }
      })
    },
    viewDetail() {
      this.$refs.app.doCreate(true, this.multipleSelection[0])
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    // 删除文件
    FileDelete(id) {
      var params = {
        app_ids: id
      }
      MessageBox.confirm('此操作将永久删除该命令，是否继续', '删除风险命令', { type: 'error' }).then(() => {
        deleteApp(params).then(response => {
          this.getList()
          Message.success('删除成功')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    // 编辑文件
    FileEdit(id) {
      this.$router.push({
        name: 'addApp',
        params: {
          id: id[0]
        }
      })
    },
    // 重置
    searchReset() {
      this.form = JSON.parse(JSON.stringify(formData))
      this.getList()
    },
    // 添加，编辑 应用
    goCreate() {
      this.$router.push({
        name: 'addApp'
      })
    },
    getList() {
      const params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10,
        'instance_name': this.form.instance_name,
        'type': this.form.type,
        'creator': this.form.creator,
        'name': this.form.name,
        'version': this.form.version,
        'publisher': this.form.publisher,
        'instance_status': this.form.instance_status,
        'end_time': this.form.datatime && this.form.datatime[1] || null,
        'start_time': this.form.datatime && this.form.datatime[0] || null
      }
      this.listLoading = true
      getApplicationList(params).then(response => {
        this.listData = response.items
        this.listLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
    },
    // 匹配 =》 实例名称
    slmSearch(queryString, cb) {
      const params = {
        'instance_name': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
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
    // 匹配 =》 创建人
    creatorSearch(queryString, cb) {
      const params = {
        'creator': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
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
    // 匹配 =》 发布人
    fbrSearch(queryString, cb) {
      const params = {
        'publisher': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.publisher
          })
        }
        cb(this.unique(list))
      }).catch(error => {
        Message.error(error)
      })
    },
    // 匹配 =》 应用
    nameSearch(queryString, cb) {
      const params = {
        'name': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
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
    // 匹配 =》 版本
    versionSearch(queryString, cb) {
      const params = {
        'version': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.version
          })
        }
        cb(this.unique(list))
      }).catch(error => {
        Message.error(error)
      })
    },
    // 匹配 =》 类型
    typeSearch(queryString, cb) {
      const params = {
        'type': queryString
      }
      var list = []
      getApplicationSearch(params).then(response => {
        for (const i of response) {
          list.push({
            'value': i.type
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
    // 多选
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
