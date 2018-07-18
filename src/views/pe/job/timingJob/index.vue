<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <!-- 筛选 -->
      <el-form
        size="small"
        label-width="70px"
        label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="作业名">
              <el-select v-model="form.job_name" placeholder="请选择">
                <el-option v-for="(item, index) in job_name_arr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统">
              <el-select v-model="form.system_type" placeholder="请选择">
                <el-option v-for="(item, index) in system_type_arr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="form.job_type" placeholder="请选择">
                <el-option v-for="(item, index) in job_type_arr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-20">查询</el-button>
            <el-button size="small" icon="el-icon-refresh">重置</el-button>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-select v-model="form.job_creator" placeholder="请选择">
                <el-option v-for="(item, index) in job_creator_arr" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                size="small"
                v-model="daterange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作条 -->
      <div class="toolbar">
        <el-button size="small" type="primary" icon="el-icon-plus" plain>添加</el-button>
        <div>
          <el-button size="small" plain :disabled="multipleStart">启用</el-button>
          <el-button size="small" plain :disabled="multipleStop">停用</el-button>
          <el-button size="small" type="danger" plain :disabled="multipleDelete">删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          :data="data"
          :row-style="rowStyle"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="task_name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="task_creator" label="创建人"></el-table-column>
          <el-table-column prop="updated_at" label="创建时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="task_type" label="系统类型"></el-table-column>
          <el-table-column prop="task_language" label="作业类型"></el-table-column>
          <el-table-column prop="task_description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.task_risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="task_is_enable" label="状态" :formatter="formatterEnable"></el-table-column>
          <el-table-column prop="task_approver" label="执行次数"></el-table-column>
          <el-table-column prop="task_approver" label="成功率"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" >编辑</el-button>
              <el-button type="text" size="small" >查看</el-button>
              <el-button type="text" size="small" >{{scope.row.task_is_enable ? '停用' : '启用'}}</el-button>
              <el-button type="text" size="small" class="danger" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total">
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'

export default {
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      form: {
        job_name: '',
        system_type: '',
        job_type: '',
        job_creator: '',
        job_start_time: '',
        job_end_time: '',
        page: 1,
        per_page: 10
      },
      job_name_arr: [],
      system_type_arr: [],
      job_type_arr: [],
      job_creator_arr: [],
      daterange: '',
      multipleSelection: [],
      multipleStart: true,
      multipleStop: true,
      multipleDelete: true,
      data: [],
      total: 0
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    },
    multipleSelection(arr) {
      const length = arr.length
      if (length) {
        this.multipleDelete = false

        let enable = 0
        for (let i = 0; i < length; i++) {
          if (arr[i].task_is_enable) {
            enable++
          }
        }
        if (enable === length) {
          this.multipleStart = true
          this.multipleStop = false
        } else if (enable === 0) {
          this.multipleStart = false
          this.multipleStop = true
        } else {
          this.multipleStart = true
          this.multipleStop = true
        }
      } else {
        this.multipleStart = true
        this.multipleStop = true
        this.multipleDelete = true
      }
    }
  },
  created() {

  },
  methods: {
    rowStyle({ row, rowIndex }) {
      if (!row.task_is_enable) {
        return {
          color: '#BFBFBF'
        }
      }
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterEnable(row) {
      if (row.task_is_enable) {
        return '可用'
      }
      return '停用'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePageChange(val) {
      this.getListData(val)
    },
    getListData(index) {
      // const params = this.form
      // if (index) {
      //   params.page = index
      // }
      // getListApi(params).then(res => {
      //   this.data = res.items
      //   this.total = res.total
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container-body {
  margin: 24px;
  padding: 29px 32px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.margl-20 {
  margin-left: 20px;
}
.toolbar {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.table {
  margin-top: 18px;
  & /deep/ .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.danger {
  color: #f56c6c;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
