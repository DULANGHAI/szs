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
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="任务名">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option :label="'命令'" :value="'command'"></el-option>
                <el-option :label="'脚本'" :value="'script'"></el-option>
                <el-option :label="'文件分发'" :value="'file'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="目标系统">
              <el-select v-model="form.target_system" @change="systemChange" placeholder="请选择" :disabled="!Object.keys(systemAndLang).length">
                <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="语言">
              <el-select v-model="form.language" placeholder="请选择" :disabled="!form.target_system">
                <el-option v-for="(item, index) in systemAndLang[form.target_system]" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="风险等级">
              <el-select v-model="form.risk_level" placeholder="请选择">
                <el-option :label="'低'" :value="'1'"></el-option>
                <el-option :label="'中'" :value="'2'"></el-option>
                <el-option :label="'高'" :value="'3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建者">
              <el-select v-model="form.creator" placeholder="请选择">
                <el-option v-for="name in creaters" :key="name" :label="name" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.is_enable" placeholder="请选择">
                <el-option :label="'启用'" :value="1"></el-option>
                <el-option :label="'停用'" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-70" @click="search">查询</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="refresh">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作条 -->
      <div class="toolbar">
        <el-button size="small" type="primary" icon="el-icon-plus" plain @click="goAdd">添加</el-button>
        <div>
          <el-button size="small" plain :disabled="multipleSelection.length !== 1" @click="handleCopy">复制</el-button>
          <el-button size="small" plain :disabled="multipleStart" @click="handleMultipleStart">启用</el-button>
          <el-button size="small" plain :disabled="multipleStop" @click="handleMultipleStop">停用</el-button>
          <el-button size="small" type="danger" plain :disabled="multipleDelete" @click="handleMultipleDelete">删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          :row-style="rowStyle"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="任务名称" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="updated_at" label="修改时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="type" label="类型" :formatter="formatterTaskType"></el-table-column>
          <el-table-column prop="language" label="语言"></el-table-column>
          <el-table-column prop="target_system" label="目标系统"></el-table-column>
          <el-table-column prop="description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="is_enable" label="状态" :formatter="formatterEnable"></el-table-column>
          <el-table-column prop="status" label="审批状态"></el-table-column>
          <el-table-column prop="change_result" label="编辑状态"></el-table-column>
          <el-table-column prop="approver" label="审批人"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goEdit(scope.row.id)" :disabled="scope.row.status === '审批中' || scope.row.change_result === '修改内容审批中'">编辑</el-button>
              <el-button type="text" size="small" @click="goView(scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="handleSingleStatus(scope.row)">{{scope.row.is_enable ? '停用' : '启用'}}</el-button>
              <el-button type="text" size="small" class="danger" @click="handleSingleDelete(scope.row.id)" :disabled="scope.row.is_enable">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total">
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 复制任务model -->
    <copy-model ref="copyModel" :data="multipleSelection[0]" :refresh="refresh"></copy-model>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import CopyModel from './components/CopyModel'

import { getListApi, getCreatorApi, getLanguageApi, changeTaskStatusApi, deleteTaskApi } from '@/api/pe/taskManage/taskList'

const taskTypeMap = {
  command: '命令',
  script: '脚本',
  file: '文件分发'
}

export default {
  components: {
    Breadcrumb,
    RiskLevel,
    CopyModel
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: '',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        is_enable: '',
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0,
      creaters: [],
      systemAndLang: {},
      multipleSelection: [],
      multipleStart: true,
      multipleStop: true,
      multipleDelete: true
    }
  },
  watch: {
    multipleSelection(arr) {
      const length = arr.length
      if (length) {
        let enable = 0
        for (let i = 0; i < length; i++) {
          if (arr[i].is_enable) {
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
    this.loading = true
    Promise.all([getLanguageApi(), getListApi(this.form), getCreatorApi()])
      .then(res => {
        this.systemAndLang = res[0]
        this.data = res[1].items
        this.total = res[1].total
        this.creaters = res[2].creator
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
  },
  methods: {
    /**
     * 表格内容格式化
     */
    rowStyle({ row, rowIndex }) {
      if (!row.is_enable) {
        return {
          color: '#BFBFBF'
        }
      }
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTaskType(row) {
      return taskTypeMap[row.type]
    },
    formatterEnable(row) {
      if (row.is_enable) {
        return '启用'
      }
      return '停用'
    },
    /**
     * 接口
     */
    getListData(index) {
      this.loading = true
      const params = this.form
      if (index) {
        params.page = index
      }
      getListApi(params).then(res => {
        this.data = res.items
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLanguage() {
      getLanguageApi().then(res => {
        this.systemAndLang = res
      })
    },
    changeTaskStatus(data) {
      changeTaskStatusApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    deleteTasks(data) {
      deleteTaskApi(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getListData()
      })
    },
    getTaskIds() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    /**
     * 交互操作
     */
    search() {
      this.getListData(1)
    },
    refresh() {
      this.form = {
        name: '',
        type: '',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        is_enable: '',
        page: 1,
        per_page: 10
      }
      this.multipleSelection = []
      this.search()
    },
    handlePageChange(val) {
      this.form.page = val
      this.getListData()
    },
    systemChange() {
      this.form.language = ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCopy() {
      this.$refs.copyModel.showModel()
    },
    handleMultipleStart() {
      this.$confirm('确认要启用这些任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const ids = this.getTaskIds()
        this.changeTaskStatus({
          task_ids: ids,
          is_enable: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },
    handleMultipleStop() {
      this.$confirm('确认要停用这些任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.getTaskIds()
        this.changeTaskStatus({
          task_ids: ids,
          is_enable: false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        })
      })
    },
    handleMultipleDelete() {
      this.$confirm('确认要删除这些任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = this.getTaskIds()
        this.deleteTasks({
          task_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSingleStatus(row) {
      if (row.is_enable) { // 处在启用状态，要停用
        this.$confirm('确认要停用这条任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          ids.push(row.id)
          this.changeTaskStatus({
            task_ids: ids,
            is_enable: false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          })
        })
      } else {
        this.$confirm('确认要启用这条任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          const ids = []
          ids.push(row.id)
          this.changeTaskStatus({
            task_ids: ids,
            is_enable: true
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      }
    },
    handleSingleDelete(id) {
      this.$confirm('确认要删除这条任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        ids.push(id)
        this.deleteTasks({
          task_ids: ids
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    goAdd() {
      this.$router.push({
        path: '/pe/taskManage/taskAdd'
      })
    },
    goEdit(id) {
      this.$router.push({
        path: `/pe/taskManage/taskEdit/${id}`
      })
    },
    goView(id) {
      this.$router.push({
        path: `/pe/taskManage/taskView/${id}/1`
      })
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
