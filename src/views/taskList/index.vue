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
              <el-select v-model="form.task_name" placeholder="请选择">
                <el-option :label="'任务名1'" :value="'任务名1'"></el-option>
                <el-option :label="'任务名2'" :value="'任务名2'"></el-option>
              </el-select>
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
            <el-form-item label="目标系统">
              <el-select v-model="form.task_target_system" placeholder="请选择">
                <el-option :label="'test1'" :value="'test1'"></el-option>
                <el-option :label="'test2'" :value="'test2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="语言">
              <el-select v-model="form.task_language" placeholder="请选择">
                <el-option :label="'node'" :value="'node'"></el-option>
                <el-option :label="'shell'" :value="'shell'"></el-option>
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
              <el-select v-model="form.task_creator" placeholder="请选择">
                <el-option :label="'创建者1'" :value="'创建者1'"></el-option>
                <el-option :label="'创建者2'" :value="'创建者2'"></el-option>
                <el-option :label="'创建者3'" :value="'创建者3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.task_status" placeholder="请选择">
                <el-option :label="'高'" :value="'高'"></el-option>
                <el-option :label="'中'" :value="'中'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" icon="el-icon-search" class="margl-70">查询</el-button>
            <el-button size="small" icon="el-icon-refresh">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作条 -->
      <div class="toolbar">
        <el-button size="small" type="primary" icon="el-icon-plus" plain>添加</el-button>
        <div>
          <el-button size="small" plain>启用</el-button>
          <el-button size="small" plain>停用</el-button>
          <el-button size="small" type="danger" plain>删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <el-table
          ref="table"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="task_name" label="任务名称" width="130px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="task_creator" label="创建人"></el-table-column>
          <el-table-column prop="updated_at" label="修改时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="task_type" label="类型"></el-table-column>
          <el-table-column prop="task_language" label="语言"></el-table-column>
          <el-table-column prop="task_target_system" label="目标系统"></el-table-column>
          <el-table-column prop="task_description" label="描述" width="160px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="风险等级" width="88px">
            <template slot-scope="scope">
              <risk-level :level="scope.task_risk_level"></risk-level>
            </template>
          </el-table-column>
          <el-table-column prop="task_status" label="状态"></el-table-column>
          <el-table-column prop="task_approver" label="审批人"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" disabled size="small">编辑</el-button>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">停用</el-button>
              <el-button type="text" size="small" class="danger">删除</el-button>
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
    return {
      form: {
        task_name: '',
        task_type: '',
        task_target_system: '',
        task_language: '',
        task_risk_level: '',
        task_creator: '',
        task_status: ''
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
          'task_status': 'string'
        }
      ]
    }
  },
  methods: {
    // formatterTaskName(row) {
    //   return `<div class="cell ellipsis">${row.task_name}</div>`
    // },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
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
