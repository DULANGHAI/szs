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
                v-model="daterange"
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
                <el-option label="通知" value="0"></el-option>
                <el-option label="确认" value="1"></el-option>
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
                <el-option label="已确认" value="0"></el-option>
                <el-option label="无需确认" value="1"></el-option>
                <el-option label="未确认" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex-end">
          <el-button type="primary" size="small" @click="handleSearchBtn">查询</el-button>
        </div>
      </el-form>

      <el-table
        ref="table"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 30px"
        empty-text="暂无数据"
        v-loading="loading">
        <el-table-column prop="created_at" label="时间" width="160px" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="classify" label="类型" :formatter="formatterType"></el-table-column>
        <el-table-column label="风险等级">
          <template slot-scope="scope">
            <risk-level :level="scope.row.risk_level"></risk-level>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="消息" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatterStatus"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status === '0'" disabled>已确认</el-button>
            <el-button type="text" v-else-if="scope.row.status === '2'" @click="handleConfirmBtn(scope.row)">确认</el-button>
            <el-button type="text" v-else disabled>/</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="total">
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { getsystemMessage, confirmMessage } from '@/api/systemManage/system.js'

const message_type_map = {
  '0': '通知',
  '1': '确认'
}
const status_map = {
  '0': '已确认',
  '1': '无需确认',
  '2': '未确认'
}

export default {
  name: 'info',
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      loading: false,
      total: 0, // 总条目数
      tableData: [],
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
      daterange: '',
      queryForm: {
        start_time: '',
        end_time: '',
        type: '',
        riskLevel: '',
        status: '',
        page: 1,
        per_page: 10
      }
    }
  },
  watch: {
    daterange(val) {
      this.queryForm.start_time = val[0]
      this.queryForm.end_time = val[1]
    }
  },
  created() {
    this.getListData(1)
  },
  methods: {
    getListData(index) {
      this.loading = true
      const params = this.queryForm
      if (index) {
        params.page = index
      }
      getsystemMessage(params).then(res => {
        this.tableData = res.items
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.getListData(val)
    },
    handleSearchBtn() {
      this.getListData(1)
    },
    formatterTime(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterType(row) {
      return message_type_map[row.classify]
    },
    formatterStatus(row) {
      return status_map[row.status]
    },
    handleConfirmBtn(row) {
      this.$confirm('是否根据消息中的要求已完成相关操作？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          confirmMessage(row.id, { status: '0' }).then(() => {
            this.$message({
              type: 'success',
              message: '消息已确认!'
            })
            this.getListData()
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

<style lang="scss" scoped>
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>

