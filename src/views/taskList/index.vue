<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      任务列表
    </div>
    <div class="container-body">
      <!-- 筛选 -->
      <el-form
        size="small"
        label-width="70px"
        label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="任务名">
              <el-input v-model="form.task_name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="form.task_type" placeholder="请选择">
                <el-option :label="'命令'" :value="'commond'"></el-option>
                <el-option :label="'脚本'" :value="'script'"></el-option>
                <el-option :label="'文件分发'" :value="'file'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="目标系统" v-if="systemAndLang && Object.keys(systemAndLang).length">
              <el-select v-model="form.task_target_system" @change="systemChange" placeholder="请选择">
                <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="语言" v-if="form.task_target_system">
              <el-select v-model="form.task_language" placeholder="请选择">
                <el-option v-for="(item, index) in systemAndLang[form.task_target_system]" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="风险等级">
              <el-select v-model="form.task_risk_level" placeholder="请选择">
                <el-option :label="'低'" :value="'1'"></el-option>
                <el-option :label="'中'" :value="'2'"></el-option>
                <el-option :label="'高'" :value="'3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建者">
              <el-select v-model="form.task_creator" multiple placeholder="请选择">
                <el-option v-for="name in creaters" :key="name" :label="name" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.task_is_enable" placeholder="请选择">
                <el-option :label="'可用'" :value="1"></el-option>
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
          <el-button size="small" plain :disabled="multipleStart" @click="handleMultipleStart">启用</el-button>
          <el-button size="small" plain :disabled="multipleStop" @click="handleMultipleStop">停用</el-button>
          <el-button size="small" type="danger" plain :disabled="multipleDelete" @click="handleMultipleDelete">删除</el-button>
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
          <el-table-column prop="task_name" label="任务名称" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="task_creator" label="创建人"></el-table-column>
          <el-table-column prop="updated_at" label="修改时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="task_type" label="类型" :formatter="formatterTaskType"></el-table-column>
          <el-table-column prop="task_language" label="语言"></el-table-column>
          <el-table-column prop="task_target_system" label="目标系统"></el-table-column>
          <el-table-column prop="task_description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.row.task_risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="task_is_enable" label="状态" :formatter="formatterEnable"></el-table-column>
          <el-table-column prop="task_approver" label="审批人"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
              <el-button type="text" size="small" @click="goView(scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="handleSingleStatus(scope.row)">{{scope.row.task_is_enable ? '停用' : '启用'}}</el-button>
              <el-button type="text" size="small" class="danger" @click="handleSingleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div>
        <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'

import { getListApi, getCreatorApi, getLanguageApi, changeTaskStatusApi, deleteTaskApi } from '@/api/taskList'

const taskTypeMap = {
  commond: '命令',
  script: '脚本',
  file: '文件分发'
}

export default {
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      form: {
        task_name: '',
        task_type: '',
        task_target_system: '',
        task_language: '',
        task_risk_level: '',
        task_creator: [],
        task_is_enable: '',
        page: 1,
        per_page: 20
      },
      data: [
        {
          'updated_at': '2018-07-09T07:08:45.521Z',
          'task_risk_statement': 'string',
          'task_file_permission': 'string',
          'task_command': 'string',
          'deleted_at': '2018-07-09T07:08:45.521Z',
          'id': 0,
          'task_is_enable': true,
          'task_creator': 'string',
          'task_file_owner': 'string',
          'task_script': 'string',
          'task_time_out': 0,
          'task_description': 'string',
          'task_file_selection': 'string',
          'task_script_parameter': 'string',
          'task_is_replace': true,
          'task_approver': 'string',
          'task_type': 'string',
          'task_language': 'string',
          'is_deleted': false,
          'task_target_system': 'string',
          'created_at': '2018-07-09T07:08:45.521Z',
          'task_risk_level': 1,
          'task_target_directory': 'string',
          'task_name': 'task_nametask_nametask_nametask_nametask_name',
          'task_status': 'pending'
        },
        {
          'updated_at': '2018-07-09T07:08:45.521Z',
          'task_risk_statement': 'string',
          'task_file_permission': 'string',
          'task_command': 'string',
          'deleted_at': '2018-07-09T07:08:45.521Z',
          'id': 1,
          'task_is_enable': true,
          'task_creator': 'string',
          'task_file_owner': 'string',
          'task_script': 'string',
          'task_time_out': 0,
          'task_description': 'string',
          'task_file_selection': 'string',
          'task_script_parameter': 'string',
          'task_is_replace': true,
          'task_approver': 'string',
          'task_type': 'string',
          'task_language': 'string',
          'is_deleted': false,
          'task_target_system': 'string',
          'created_at': '2018-07-09T07:08:45.521Z',
          'task_risk_level': 2,
          'task_target_directory': 'string',
          'task_name': 'task_nametask_nametask_nametask_nametask_name',
          'task_status': 'pending'
        },
        {
          'updated_at': '2018-07-09T07:08:45.521Z',
          'task_risk_statement': 'string',
          'task_file_permission': 'string',
          'task_command': 'string',
          'deleted_at': '2018-07-09T07:08:45.521Z',
          'id': 2,
          'task_is_enable': false,
          'task_creator': 'string',
          'task_file_owner': 'string',
          'task_script': 'string',
          'task_time_out': 0,
          'task_description': 'string',
          'task_file_selection': 'string',
          'task_script_parameter': 'string',
          'task_is_replace': true,
          'task_approver': 'string',
          'task_type': 'string',
          'task_language': 'string',
          'is_deleted': false,
          'task_target_system': 'string',
          'created_at': '2018-07-09T07:08:45.521Z',
          'task_risk_level': 3,
          'task_target_directory': 'string',
          'task_name': 'task_nametask_nametask_nametask_nametask_name',
          'task_status': 'pass'
        }
      ],
      creaters: ['zhangsna', 'lisi', 'wangwu'],
      systemAndLang: {
        windows: ['windows1', 'windows2', 'windows3'],
        linux: ['linux1', 'linux2', 'linux3']
      },
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
    Promise.all([getLanguageApi(), getListApi(this.form)])
      .then(res => {
        debugger
      })
  },
  methods: {
    /**
     * 表格内容格式化
     */
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
    formatterTaskType(row) {
      return taskTypeMap[row.task_type]
    },
    formatterEnable(row) {
      if (row.task_is_enable) {
        return '可用'
      }
      return '停用'
    },
    /**
     * 接口
     */
    getListData() {
      getListApi(this.form).then(res => {
        if (res.success) {
          this.data = res.items
        }
      })
    },
    getCreator() {
      getCreatorApi().then(res => {
        if (res.success) {
          this.creaters = res.task_creator
        }
      })
    },
    getLanguage() {
      getLanguageApi().then(res => {
        if (res.success) {
          this.systemAndLang = res
        }
      })
    },
    changeTaskStatus(data) {
      changeTaskStatusApi(data).then(res => {
        if (res.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    deleteTasks(data) {
      deleteTaskApi(data).then(res => {
        if (res.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
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
      this.getListData()
    },
    refresh() {
      this.form = {
        task_name: '',
        task_type: '',
        task_target_system: '',
        task_language: '',
        task_risk_level: '',
        task_creator: [],
        task_is_enable: '',
        page: 0,
        per_page: 20
      }
      this.multipleSelection = []
      this.search()
    },
    systemChange() {
      this.form.task_language = ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
          task_is_enable: true
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
          task_is_enable: false
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
      if (row.task_is_enable) { // 处在启用状态，要停用
        this.$confirm('确认要停用这条任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          ids.push(row.id)
          this.changeTaskStatus({
            task_ids: ids,
            task_is_enable: false
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
            task_is_enable: true
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
        path: '/taskManage/taskAdd'
      })
    },
    goEdit(id) {
      this.$router.push({
        path: `/taskManage/taskEdit/${id}`
      })
    },
    goView(id) {
      this.$router.push({
        path: `/taskManage/taskView/${id}/1`
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
</style>
