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
          <el-form-item label="执行时间">
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
    
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="table"
        :data="data"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column prop="execution_id" label="执行ID"></el-table-column>
        <el-table-column prop="created_at" label="执行时间" :formatter="formatterTime1"></el-table-column>
        <el-table-column prop="creator" label="执行人"></el-table-column>
        <el-table-column prop="name" label="作业名"></el-table-column>
        <el-table-column prop="job_type" label="作业类型" :formatter="formatterJobType"></el-table-column>
        <el-table-column prop="system_type" label="系统类型"></el-table-column>
        <el-table-column prop="target_ip" label="目标IP" width="160px" :formatter="formatterIp" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="time" label="执行耗时"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" :formatter="formatterTime2"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small">执行</el-button>
            <el-button type="text" size="small">停止</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getLanguageApi, getRecordListApi, getCreatorApi } from '@/api/pe/jobManage/timedJob'

export default {
  components: {
    Treeselect
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
          id: 'c',
          label: 'c'
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
        execution_type: 'timed',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      systemAndLang: {},
      creator_arr: [],
      daterange: ''
    }
  },
  watch: {
    daterange(val) {
      this.form.start_time = val[0]
      this.form.end_time = val[1]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([getLanguageApi(), getRecordListApi(this.form), getCreatorApi()]).then(res => {
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
      return this.$dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterIp(row) {
      const data = JSON.parse(row.target_ip).host
      return data.toString()
    },
    getListData(index) {
      const params = this.form
      if (index) {
        params.page = index
      }
      getRecordListApi(params).then(res => {
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
