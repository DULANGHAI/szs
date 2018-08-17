<template>
  <div>
    <Breadcrumb></Breadcrumb>

    <div class="container-title">
      消息
    </div>

    <div class="container-body-wrap">
      <el-form
        size="small"
        label-width="70px"
        label-position="right"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item label="时间">
              <el-date-picker
                v-model="queryForm.date"
                type="daterange"
                style="width:100%"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="类型">
              <el-select v-model="queryForm.type" placeholder="请选择">
                <el-option label="通知" value="notification"></el-option>
                <el-option label="确认" value="confirm"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="风险">
              <el-select v-model="queryForm.riskLevel" placeholder="请选择">
                <el-option
                  v-for="(item, index) in levelOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" placeholder="请选择">
                <el-option label="已确认" value="已确认"></el-option>
                <el-option label="未确认" value="未确认"></el-option>
                <el-option label="无需确认" value="无需确认"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" :offset="22">
            <el-button type="primary" size="small" @click="handleSearchBtn">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="table"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 30px"
        empty-text="暂无数据"
        v-loading.body="tableLoading">
        <el-table-column prop="created_at" label="时间"></el-table-column>
        <el-table-column prop="classify" label="类型"></el-table-column>
        <el-table-column label="风险等级">
          <template slot-scope="scope">
            <risk-level :level="scope.row.risk_level"></risk-level>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="消息">
        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleConfirmBtn">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="total > 0"
        style="text-align: right"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizesArray"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { createsystemMessage, getsystemMessage } from '@/api/systemManage/system.js'

export default {
  name: 'info',
  data() {
    return {
      currentPage: 1, // 当前页数
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 0, // 每页显示条目个数
      total: 0, // 总条目数
      tableData: [],
      tableLoading: false,
      levelOptions: [
        {
          label: '低危',
          value: 1
        },
        {
          label: '中危',
          value: 2
        },
        {
          label: '高危',
          value: 3
        }
      ],
      queryForm: {
        date: '',
        type: '',
        riskLevel: '',
        status: ''
      }
    }
  },
  components: {
    Breadcrumb,
    RiskLevel
  },
  created() {
    this.tableData = [
      // {
      //   time: "2018-02-02",
      //   type: "通知",
      //   info: "XSS系统异常,访问查看详情",
      //   status: "已确认"
      // },
      // {
      //   time: "2018-02-02",
      //   type: "通知",
      //   info: "XSS系统异常,访问查看详情",
      //   status: "已确认"
      // }
    ]
    this.total = 2
  },
  mounted() {
  // createsystemMessage({
  //   content:'1',
  //   status:'200',
  //   usernames:['111'],
  //   risk_level:'1',
  //   classify:'1'
  // }).then(res=>{
  //   console.log(res,'33')
  // }).catch(res=>{

  // })
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSearchBtn() {
      getsystemMessage({
        page: this.currentPage,
        per_page: this.total
      })
        .then(res => {
          this.tableData = res.items
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].classify == '0') this.tableData[i].classify = '通知'
            if (this.tableData[i].classify == '1') this.tableData[i].classify = '确认'

            if (this.tableData[i].status == '0') this.tableData[i].status = '已确认'
            if (this.tableData[i].status == '1') this.tableData[i].status = '无需确认'
            if (this.tableData[i].status == '2') this.tableData[i].status = '没有确认'

            if (this.tableData[i].risk_level == '0') this.tableData[i].risk_level = '1'
            if (this.tableData[i].risk_level == '1') this.tableData[i].risk_level = '2'
            if (this.tableData[i].risk_level == '2') this.tableData[i].risk_level = '3'
          }
          // this.queryForm.type=res.classify
          // this.queryForm.riskLevel=res.risk_level
          // this.queryForm.status=res.status
          console.log(res, '1')
        })
        .catch(error => {
          console.log('2')
        })
    },
    handleConfirmBtn() {
      this.$confirm('是否根据消息中的要求已完成相关操作？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '消息已确认!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
