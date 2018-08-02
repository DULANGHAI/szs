<template>
  <div class="container">
    <!-- 筛选 -->
    <el-form
      size="small"
      label-width="70px"
      label-position="right">
      <el-row>
        <el-col :span="6">
          <el-form-item label="作业名">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统类型">
            <el-select v-model="form.system_type">
              <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业类型">
            <el-select v-model="form.job_type">
              <el-option v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="job_type_map[item]" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目标IP">
            <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="创建人">
            <el-select v-model="form.creator">
              <el-option v-for="item in creator_arr" :key="item" :label="item" :value="item"></el-option>
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
        <el-col :span="6" :offset="6">
          <el-button size="small" type="primary" icon="el-icon-search" class="margl-20" @click="search">查询</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作条 -->
    <div class="toolbar">
      <el-button size="small" type="primary" icon="el-icon-plus" plain @click="addTimedJob">添加</el-button>
      <div>
        <el-button size="small" plain :disabled="multipleStart" >启用</el-button>
        <el-button size="small" plain :disabled="multipleStop" >停用</el-button>
        <el-button size="small" type="danger" plain :disabled="multipleDelete" @click="handleMultipleDelete">删除</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="table"
        :data="data"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="作业名"></el-table-column>
        <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime1"></el-table-column>
        <el-table-column prop="timed_type" label="定时类型"></el-table-column>
        <el-table-column prop="system_type" label="系统"></el-table-column>
        <el-table-column prop="target_ip" label="目标IP" width="160px" :formatter="formatterIp" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="风险等级" width="88px">
          <template slot-scope="scope">
            <risk-level :level="scope.row.risk_level"></risk-level>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="frequency" label="执行次数"></el-table-column>
        <el-table-column prop="last_time" label="上次执行时间" :formatter="formatterTime2"></el-table-column>
        <el-table-column prop="success_rate" label="成功率"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleJobSet(scope.row)" :disabled="scope.row.status === 1 ? true : false">定时作业配置</el-button>
            <el-button type="text" size="small" @click="handleTaskSet(scope.row)" :disabled="scope.row.status === 1 ? true : false">任务配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="total">
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
    </div>

    <!-- 添加/编辑 定时作业model -->
    <add-timed ref="addModel" :type="addType" :data="needSetJob" :refresh="getListData"></add-timed>
    <!-- 任务配置 -->
    <task-config ref="taskConfig" :data="needSetJob" :refresh="getListData"></task-config>
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import AddTimed from './components/AddTimed'
import TaskConfig from './components/TaskConfig'

import { getLanguageApi, getJobListApi, getCreatorApi, deleteJobApi } from '@/api/pe/jobManage/timedJob'

export default {
  components: {
    RiskLevel,
    Treeselect,
    AddTimed,
    TaskConfig
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {
      options: [
        {
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa'
            },
            {
              id: 'ab',
              label: 'ab'
            }
          ]
        },
        {
          id: 'b',
          label: 'b'
        },
        {
          id: '10.111.2.40',
          label: '10.111.2.40'
        }
      ],
      form: {
        name: '',
        system_type: '',
        job_type: '',
        target_ip: [],
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      systemAndLang: {},
      creator_arr: [],
      daterange: '',
      multipleSelection: [],
      multipleStart: true,
      multipleStop: true,
      multipleDelete: true,
      addType: 'add',
      needSetJob: null // 需要配置的作业信息
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
        let enable = 0
        for (let i = 0; i < length; i++) {
          if (arr[i].status) {
            enable++
          }
        }
        if (enable === length) {
          this.multipleStart = true
          this.multipleStop = false
          this.multipleDelete = true
        } else if (enable === 0) {
          this.multipleStart = false
          this.multipleStop = true
          this.multipleDelete = false
        } else {
          this.multipleStart = true
          this.multipleStop = true
          this.multipleDelete = true
        }
      } else {
        this.multipleStart = true
        this.multipleStop = true
        this.multipleDelete = true
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([getLanguageApi(), getJobListApi(this.form), getCreatorApi()]).then(res => {
        this.systemAndLang = res[0]
        this.data = res[1].items
        this.total = res[1].total
        this.creator_arr = res[2].creator
      })
    },
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterTime1(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime2(row) {
      if (row.last_time) {
        return this.$dayjs(row.last_time).format('YYYY-MM-DD HH:mm:ss')
      }
      return '/'
    },
    formatterIp(row) {
      const data = JSON.parse(row.target_ip).host
      return data.toString()
    },
    formatterStatus(row) {
      return row.status === 1 ? '启用' : '禁用'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getListData(index) {
      const params = this.form
      if (index) {
        params.page = index
      }
      getJobListApi(params).then(res => {
        this.data = res.items
        this.total = res.total
      })
    },
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        name: '',
        system_type: '',
        job_type: '',
        target_ip: [],
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      }
      this.daterange = ''
      this.multipleSelection = []
      this.init()
    },
    // 创建定时作业
    addTimedJob() {
      this.addType = 'add'
      this.$refs.addModel.showMoel()
    },
    /**
     * 列表操作
     */
    deleteTasks(data) {
      deleteJobApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    handlePageChange(val) {
      this.getListData(val)
    },
    getJobIds() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    handleMultipleDelete() {
      this.$confirm('确认要删除这些任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = this.getJobIds()
        this.deleteTasks({
          job_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 定时作业配置
    handleJobSet(row) {
      this.addType = 'edit'
      this.needSetJob = row
      this.$refs.addModel.showMoel()
    },
    // 任务配置
    handleTaskSet(row) {
      this.needSetJob = row
      this.$refs.taskConfig.showMoel()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  & /deep/ .el-select {
    width: 100%;
  }
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
