<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      文件审批
    </div>
    <div class="container-body-wrap review-body">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="7">
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
            <el-col :span="6">
              <el-form-item label="提交人">
                <el-input v-model="form.submitter" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审批人">
                <el-input v-model="form.approver" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="文件类型">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option v-for="item in fileStutas" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文件名">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div style="margin-left:20px">
                <el-button size="small" type="primary" @click.native="getList">查询</el-button>
                <el-button size="small" @click.native="searchReset">重置</el-button>
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
          style="width: 100%"
          v-loading.body="listLoading"
          empty-text="暂无数据">
          <el-table-column
            label="文件名">
            <template slot-scope="scope">
              <span><svg-icon :icon-class="scope.row.scripts[0].type === 'tree' ? 'wenjianjia' : 'wenjian'" /> {{ scope.row.scripts[0].name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="文件类型">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="提交说明">
          </el-table-column>
          <el-table-column
            prop="submitter"
            label="提交人">
          </el-table-column>
          <el-table-column
            prop="created_at"
            :formatter="formatterTime"
            label="提交时间">
          </el-table-column>
          <el-table-column
            label="风险等级">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column
            prop="approver"
            label="审批人">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <div v-html="scope.row.status"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row.id)">查看</el-button>
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
import { getReviewList } from '@/api/resouce/versionLibrary/review'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'

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
      fileTypeList: [{
        label: '脚本',
        value: 'scripts'
      }, {
        label: '软件包',
        value: 'applications'
      }, {
        label: '配置文件',
        value: 'configurations'
      }],
      fileStutas: [{
        label: '审批中',
        value: 'pending'
      }, {
        label: '通过',
        value: 'pass'
      }, {
        label: '拒绝',
        value: 'not_pass'
      }],
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
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    // 重置
    searchReset() {
      this.form = JSON.parse(JSON.stringify(formData))
      this.getList()
    },
    getList() {
      const params = {
        'page': this.currentPage,
        'per_page': this.pageSizes || 10,
        'end_time': this.form.datatime && this.form.datatime[1] || null,
        'start_time': this.form.datatime && this.form.datatime[0] || null,
        'submitter': this.form.submitter,
        'approver': this.form.approver,
        'type': this.form.type,
        'status': this.form.status,
        'name': this.form.name
      }
      this.listLoading = true
      getReviewList(params).then(response => {
        this.listData = response.items.map(item => {
          let ftype
          switch (item.type) {
            case 'applications':
              ftype = '软件包'
              break
            case 'scripts':
              ftype = '脚本'
              break
            case 'configurations':
              ftype = '配置文件'
              break
          }
          let fstatus
          switch (item.status) {
            case 'initial':
              fstatus = '<span>审批中</span>'
              break
            case 'pending':
              fstatus = '<span>审批中</span>'
              break
            case 'pass':
              fstatus = '<span style="color:green">通过</span>'
              break
            case 'not_pass':
              fstatus = '<span style="color:red">拒绝</span>'
              break
          }
          return {
            'scripts': item.scripts,
            'type': ftype,
            'comment': item.comment,
            'created_at': item.created_at,
            'submitter': item.submitter,
            'risk_level': item.risk_level,
            'approver': item.approver || '/',
            'status': fstatus,
            'id': item.id
          }
        })
        this.listLoading = false
        this.totalPage = response.total
      }).catch(error => {
        Message.error(error)
      })
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
