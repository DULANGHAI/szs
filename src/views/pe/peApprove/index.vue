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
      <el-form size="small" label-width="70px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(job_status_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-20" @click="search">查询</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="执行人">
              <el-select v-model="form.executor">
                <el-option v-for="(item, index) in executor_arr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="审批人">
              <el-select v-model="form.approver">
                <el-option v-for="(item, index) in approver_arr" :key="index" :label="item.name" :value="item.id"></el-option>
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

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="" label="提交时间"></el-table-column>
          <el-table-column prop="" label="执行人"></el-table-column>
          <el-table-column prop="" label="类型"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="" label="目标IP"></el-table-column>
          <el-table-column prop="" label="开始时间"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="" label="状态"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" >详情</el-button>
              <el-button type="text" size="small" >通过</el-button>
              <el-button type="text" size="small" >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
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
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    this.job_status_map = {
      pass: '审核通过',
      pending: '审核中',
      'no-pass': '审核不同过'
    }
    return {
      form: {
        name: '',
        type: '',
        status: '',
        executor: '',
        approver: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      executor_arr: [],
      approver_arr: [],
      daterange: '',
      data: [],
      total: 0
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  methods: {
    search() {},
    refresh() {}
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
.margl-70 {
  margin-left: 70px;
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
