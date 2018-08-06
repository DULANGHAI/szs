<template>
  <div class="container-body">
    <div class="container-content">
      <!-- 左侧筛选列表 -->
      <div class="left">
        <!-- 筛选 -->
        <div class="job-filter">
          <el-input placeholder="可搜索流程名"
            suffix-icon="el-icon-search"
            v-model="form1.name">
          </el-input>
        </div>
        <!-- 列表 -->
        <div class="job-list">
          <div v-for="(item, index) in dataFlow" :key="index">
            <flow-item :uniqueId="uniqueId" :data="item" :selected="selectedFlow" :selectNode="selectNode"></flow-item>
          </div>
          <infinite-loading ref="infiniteLoading" @infinite="loadMore" spinner="spiral">
            <span slot="no-more">
              没有更多数据了
            </span>
          </infinite-loading>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right">
        <!-- 操作列表 -->
        <div class="tool-box">
          <div class="flex">
            <div class="op-item" @click="createInstant">
              <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">创建</div>
            </div>
            <div class="op-item">
              <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">执行</div>
            </div>
          </div>
          <div class="flex">
            <div class="op-item">
              <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">删除</div>
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="table">
          <!-- <el-table
            ref="table"
            :data="data"
            tooltip-effect="dark">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="creator" label="执行人"></el-table-column>
            <el-table-column prop="job_type" label="类型"></el-table-column>
            <el-table-column prop="created_at" label="提交时间" width="160px"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small">作业配置</el-button>
                <el-button type="text" size="small">任务配置</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <tree-table :data="data" :expandAll="false" :multipleSelection.sync="multipleSelection">
            <el-table-column prop="name" label="名称" width="130px" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="job_type" label="类型"></el-table-column>
            <el-table-column prop="created_at" label="提交时间" width="160px"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small">作业配置</el-button>
                <el-button type="text" size="small">任务配置</el-button>
              </template>
            </el-table-column>
          </tree-table>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import FlowItem from './components/FlowItem'
import TreeTable from './components/TreeTable'

import { getLanguageApi, getFlowListApi } from '@/api/pe/flowManage/instantFlow'

export default {
  components: {
    InfiniteLoading,
    FlowItem,
    TreeTable
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {
      form1: { // 左侧的流程筛选列表
        name: '',
        page: 1,
        per_page: 10
      },
      dataFlow: [
        {
          id: 1,
          name: '123',
          status: true,
          description: 'tyubniafaffafa',
          scheduling: [{
            'status': true,
            'job_task_id_list': null,
            'scheduling': `{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T11:16:14\",\"risk_statement\":\"没有匹配到任何风险命令\",\"deleted_at\":null,\"id\":5,\"file_owner\":\"\",\"risk_level\":3,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"15\",\"type\":\"command\",\"status\":\"无需审批\",\"file_selection\":\"\",\"description\":\"task1\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":false,\"is_deleted\":false,\"name\":\"task1\",\"language\":\"shell\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T11:16:14\",\"file_permission\":\"\",\"command\":\"ls\",\"time_out\":1,\"next\":[{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T11:16:32\",\"risk_statement\":\"没有匹配到任何风险命令\",\"deleted_at\":null,\"id\":6,\"file_owner\":\"\",\"risk_level\":3,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"15\",\"type\":\"command\",\"status\":\"无需审批\",\"file_selection\":\"\",\"description\":\"tasks2\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":false,\"is_deleted\":false,\"name\":\"tasks2\",\"language\":\"shell\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T11:16:32\",\"file_permission\":\"\",\"command\":\"ls\",\"time_out\":1,\"next\":[{\"type\":\"end_success\",\"description\":\"\",\"is_warning\":false,\"timestr\":1533263652314,\"next\":[],\"parentstr\":1533263635045}],\"timestr\":1533263635045,\"parentstr\":1533263628915,\"condition\":{\"type\":\"success\",\"value\":\"\",\"parent\":1533263628915}}],\"timestr\":1533263628915,\"node_level\":0}`,
            'risk_level': 3,
            'description': 'tasks',
            'creator': '张三',
            'created_at': '2018-08-03T10:34:29',
            'execution_account': 'mds',
            'job_type': 'ordinary',
            'updated_at': '2018-08-03T10:34:29',
            'success_rate': 0,
            'applications': null,
            'frequency': 1,
            'system_type': 'linux',
            'target_ip': '{"host":["10.111.2.40"]}',
            'is_deleted': false,
            'deleted_at': null,
            'id': 6,
            'name': 'tasks',
            'timestr': 1533363229697
          }, {
            'status': false,
            'job_task_id_list': null,
            'scheduling': `{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T09:40:06\",\"risk_statement\":\"风险说明自动填写评估详情，用户不能修改\",\"deleted_at\":null,\"id\":2,\"file_owner\":\"王林1\",\"risk_level\":0,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"\",\"type\":\"file\",\"status\":\"无需审批\",\"file_selection\":\"[{\\\"file\\\":{\\\"update_user\\\":\\\"god\\\",\\\"name\\\":\\\"file1.txt\\\",\\\"absolute_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\",\\\"updated_at\\\":\\\"2018-08-01 06:53:15\\\",\\\"branch\\\":\\\"master\\\",\\\"path\\\":\\\"LDDS/scripts/linux/python/dir01\\\",\\\"project_id\\\":1,\\\"type\\\":\\\"blob\\\",\\\"id\\\":null,\\\"full_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\"},\\\"target_path\\\":\\\"0.0.0.0\\\"},{\\\"file\\\":{\\\"update_user\\\":\\\"god\\\",\\\"name\\\":\\\"file1.txt\\\",\\\"absolute_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\",\\\"updated_at\\\":\\\"2018-08-01 06:53:15\\\",\\\"branch\\\":\\\"master\\\",\\\"path\\\":\\\"LDDS/scripts/linux/python/dir01\\\",\\\"project_id\\\":1,\\\"type\\\":\\\"blob\\\",\\\"id\\\":null,\\\"full_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\"},\\\"target_path\\\":\\\"0.0.0.0\\\"}]\",\"description\":\"111111\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":true,\"is_deleted\":false,\"name\":\"文件分发任务1\",\"language\":\"\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T09:40:06\",\"file_permission\":\"root1\",\"command\":\"\",\"time_out\":1,\"next\":[{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T09:40:06\",\"risk_statement\":\"风险说明自动填写评估详情，用户不能修改\",\"deleted_at\":null,\"id\":2,\"file_owner\":\"王林2\",\"risk_level\":0,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"\",\"type\":\"file\",\"status\":\"无需审批\",\"file_selection\":\"[{\\\"file\\\":{\\\"update_user\\\":\\\"god\\\",\\\"name\\\":\\\"file1.txt\\\",\\\"absolute_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\",\\\"updated_at\\\":\\\"2018-08-01 06:53:15\\\",\\\"branch\\\":\\\"master\\\",\\\"path\\\":\\\"LDDS/scripts/linux/python/dir01\\\",\\\"project_id\\\":1,\\\"type\\\":\\\"blob\\\",\\\"id\\\":null,\\\"full_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\"},\\\"target_path\\\":\\\"0.0.0.0\\\"},{\\\"file\\\":{\\\"update_user\\\":\\\"god\\\",\\\"name\\\":\\\"file1.txt\\\",\\\"absolute_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\",\\\"updated_at\\\":\\\"2018-08-01 06:53:15\\\",\\\"branch\\\":\\\"master\\\",\\\"path\\\":\\\"LDDS/scripts/linux/python/dir01\\\",\\\"project_id\\\":1,\\\"type\\\":\\\"blob\\\",\\\"id\\\":null,\\\"full_path\\\":\\\"LDDS/scripts/linux/python/dir01/file1.txt\\\"},\\\"target_path\\\":\\\"0.0.0.0\\\"}]\",\"description\":\"111111\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":true,\"is_deleted\":false,\"name\":\"文件分发任务1\",\"language\":\"\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T09:40:06\",\"file_permission\":\"root2\",\"command\":\"\",\"time_out\":1,\"next\":[],\"timestr\":1533211029990,\"parentstr\":1533211023580}],\"timestr\":1533211023580,\"node_level\":0}`,
            'risk_level': 0,
            'description': '',
            'creator': '张三',
            'created_at': '2018-08-02T19:58:00',
            'execution_account': '王林',
            'job_type': 'ordinary',
            'updated_at': '2018-08-03T09:35:45',
            'success_rate': 0,
            'applications': null,
            'frequency': 2,
            'system_type': 'linux',
            'target_ip': '{"host":["10.111.2.40"]}',
            'is_deleted': false,
            'deleted_at': null,
            'id': 5,
            'name': '文件分发作业',
            'timestr': 1533363237752
          }, {
            'status': true,
            'job_task_id_list': null,
            'scheduling': `{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T11:16:14\",\"risk_statement\":\"没有匹配到任何风险命令\",\"deleted_at\":null,\"id\":5,\"file_owner\":\"\",\"risk_level\":3,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"15\",\"type\":\"command\",\"status\":\"无需审批\",\"file_selection\":\"\",\"description\":\"task1\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":false,\"is_deleted\":false,\"name\":\"task1\",\"language\":\"shell\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T11:16:14\",\"file_permission\":\"\",\"command\":\"ls\",\"time_out\":1,\"next\":[{\"creator\":\"李四\",\"target_directory\":null,\"updated_at\":\"2018-08-02T11:16:32\",\"risk_statement\":\"没有匹配到任何风险命令\",\"deleted_at\":null,\"id\":6,\"file_owner\":\"\",\"risk_level\":3,\"script_version\":\"\",\"script\":\"\",\"is_enable\":true,\"project_id\":\"15\",\"type\":\"command\",\"status\":\"无需审批\",\"file_selection\":\"\",\"description\":\"tasks2\",\"approver\":null,\"target_system\":\"linux\",\"is_replace\":false,\"is_deleted\":false,\"name\":\"tasks2\",\"language\":\"shell\",\"script_parameter\":\"\",\"created_at\":\"2018-08-02T11:16:32\",\"file_permission\":\"\",\"command\":\"ls\",\"time_out\":1,\"next\":[],\"timestr\":1533179826877,\"parentstr\":1533179820955,\"condition\":{\"type\":\"success\",\"value\":\"\",\"parent\":1533179820955}}],\"timestr\":1533179820955,\"node_level\":0}`,
            'risk_level': 3,
            'description': 'task1',
            'creator': '张三',
            'created_at': '2018-08-02T11:17:18',
            'execution_account': 'mds',
            'job_type': 'ordinary',
            'updated_at': '2018-08-02T11:17:18',
            'success_rate': 0,
            'applications': null,
            'frequency': 1,
            'system_type': 'linux',
            'target_ip': '{"host":["10.111.2.40"]}',
            'is_deleted': false,
            'deleted_at': null,
            'id': 4,
            'name': 'task1',
            'timestr': 1533363239671
          }, {
            'job_type': 'manual',
            'name': '123',
            'description': '456',
            'notifier': '假数据1',
            'notify_type': 'message',
            'timestr': 1533363241856
          }]
        }
      ],
      selectedFlow: {},
      form2: { // 右边的即时作业列表
        page: 1,
        per_page: 10
      },
      data: [],
      multipleSelection: [],
      uniqueId: +new Date(),
      needSetJob: null // 需要配置的作业信息
    }
  },
  watch: {
    'form1.name'(val, oldVal) {
      this.form1.page = 1
      this.dataFlow = []
      this.selectedFlow = {}
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    }
  },
  created() {
    Promise.all([getLanguageApi()])
      .then(res => {

      })
  },
  methods: {
    loadMore($state) {
      getFlowListApi(this.form1).then(res => {
        if (res.items.length === 0) {
          $state.loaded()
          $state.complete()
          this.$refs.infiniteLoading.isComplete = true
        } else {
          this.dataFlow = this.dataFlow.concat(res.items)
          $state.loaded()
          if (res.pages > res.page) {
            this.form1.page++
            this.$refs.infiniteLoading.isLoading = false
          } else {
            $state.complete()
            this.$refs.infiniteLoading.isComplete = true
          }
        }
      }).catch(() => {
        $state.loaded()
        $state.complete()
        this.$refs.infiniteLoading.isComplete = true
      })
    },
    selectNode(obj) {
      this.selectedFlow = obj
      this.uniqueId = +new Date()
    },
    createInstant() {
      if (!this.selectedFlow.id) {
        this.$message({
          showClose: true,
          message: '请先选中一条流程',
          type: 'error'
        })
      } else {
        this.data.push(this.selectedFlow)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.container-body {
  // margin: 24px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.container-content {
  overflow: hidden;
}
.left {
  float: left;
  width: 300px;
  padding: 29px 0 0;
  border-right: 1px solid #E8E8E8;
  .job-filter {
    display: flex;
    align-items: center;
    padding: 0 13px;
  }
  .job-list {
    margin-top: 10px;
    overflow-y: auto;
    height: 600px;
  }
}
.right {
  overflow: hidden;
  margin-left: 300px;
  padding: 29px 0;
  .tool-box {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
  }
  .op-item {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: rgba(0,0,0,0.85);
    &.disable {
      opacity: 0.65;
      pointer-events: none;
    }
  }
}
.flex {
  display: flex;
}
.mart-10 {
  margin-top: 10px;
}
.table {
  margin-top: 18px;
  & /deep/ .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
