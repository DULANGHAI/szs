<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>

    <div class="container-body">
      <!-- 流程信息 -->
      <div class="info">
        <div class="info-title">流程信息</div>
        <div class="info-content">
          <el-form size="small" label-width="70px" label-position="left">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="流程名">
                  <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用">
                  <el-switch v-model="form.status"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="描述">
                  <el-input type="textarea" v-model="form.description" rows="4" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 流程创建 -->
      <div class="container-content">
        <!-- 左侧筛选列表 -->
        <div class="left">
          <!-- 筛选 -->
          <div class="job-filter">
            <el-input placeholder="可搜索作业名"
              suffix-icon="el-icon-search"
              v-model="form1.name">
            </el-input>
            <el-dropdown>
              <span class="el-dropdown-link">
                <svg-icon :icon-class="form1.system_type ? 'filter_active' : 'filter'" :style="{ margin: '0 10px' }"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in system_type_arr"
                  :key="index"
                  @click.native="systemClick(item)">
                  <span :class="{'active-blue': form1.system_type === item.value}">{{item.label}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 列表 -->
          <div class="job-list">
            <div v-for="(item, index) in dataJob" :key="index">
              <job-item :uniqueId="uniqueId" :data="item" :selected="selectedJob" :selectNode="selectNode"></job-item>
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
              <div class="op-item" @click="addItem" :class="{disable: !selectedJob.id}">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
              <div class="op-item" @click="moveUp" :class="{disable: !selectRowIndex}">
                <svg-icon icon-class="move-up" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">上移</div>
              </div>
              <div class="op-item" @click="moveDown" :class="{disable: selectRowIndex === null || selectRowIndex === data.length - 1}">
                <svg-icon icon-class="move-down" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">下移</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">人工流程</div>
              </div>
            </div>
            <div class="flex">
              <div class="op-item" @click="deleteJpb" :class="{disable: selectRowIndex === null}">
                <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">删除</div>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <div class="table">
            <el-table
              ref="table"
              :data="data"
              tooltip-effect="dark"
              highlight-current-row
              :row-key="getRowKeys"
              @current-change="handleCurrentChange">
              <el-table-column type="index" label="执行顺序" width="80"></el-table-column>
              <el-table-column prop="name" label="作业名" width="130px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="job_type" label="类型" :formatter="formatterJobType"></el-table-column>
              <el-table-column prop="" label="失败处理方式" :formatter="formatterXxx"></el-table-column>
              <el-table-column label="风险等级" width="88px">
                <template slot-scope="scope">
                  <risk-level :level="scope.row.risk_level"></risk-level>
                </template>
              </el-table-column>
              <el-table-column prop="creator" label="创建人"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleJobSet(scope.row)">作业配置</el-button>
                  <el-button type="text" size="small" @click="handleTaskSet(scope.row)">任务配置</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


        </div>
      </div>
    </div>

    <!-- 编辑作业 -->
    <job-config ref="jobConfig" :data.sync="needSetJob" :refresh="refresh"></job-config>
    <!-- 任务配置 -->
    <task-config ref="taskConfig" :data.sync="needSetJob" :refresh="refresh"></task-config>

  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import InfiniteLoading from 'vue-infinite-loading'
import JobItem from '@/views/pe/job/instantJob/components/JobItem'
import RiskLevel from '@/components/RiskLevel'
import TaskConfig from './components/TaskConfig'
import JobConfig from './components/JobConfig'

import { getLanguageApi, getJobListApi } from '@/api/pe/flowManage/flowList'

export default {
  components: {
    Breadcrumb,
    InfiniteLoading,
    JobItem,
    RiskLevel,
    TaskConfig,
    JobConfig
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    this.xxx_map = ['暂停', '继续下一个作业']
    return {
      form: {
        name: '',
        status: '',
        description: ''
      },
      form1: { // 左侧的作业筛选列表
        name: '',
        system_type: '',
        type: '',
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      dataJob: [],
      selectedJob: {},
      system_type_arr: [],
      uniqueId: +new Date(),
      data: [],
      selectRow: {},
      needSetJob: null // 需要配置的作业信息
    }
  },
  computed: {
    selectRowIndex() {
      if (this.selectRow.timestr) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].timestr === this.selectRow.timestr) {
            return i
          }
        }
      } else {
        return null
      }
    }
  },
  watch: {
    'form1.name'(val, oldVal) {
      this.form1.page = 1
      this.dataJob = []
      this.selectedJob = {}
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    }
  },
  created() {
    Promise.all([getLanguageApi()])
      .then(res => {
        this.system_type_arr = this.handleSystemData(res[0])
      })
  },
  methods: {
    handleSystemData(data) {
      const result = [{ label: '全部', value: '' }]
      Object.keys(data).forEach((item) => {
        result.push({ label: item, value: item })
      })
      return result
    },
    systemClick(item) {
      if (this.form1.system_type !== item.value) {
        this.form1.system_type = item.value
        this.form1.page = 1
        this.dataJob = []
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
    },
    loadMore($state) {
      getJobListApi(this.form1).then(res => {
        if (res.items.length === 0) {
          $state.loaded()
          $state.complete()
          this.$refs.infiniteLoading.isComplete = true
        } else {
          this.dataJob = this.dataJob.concat(res.items)
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
      this.selectedJob = obj
      this.uniqueId = +new Date()
    },
    addItem() {
      const temp = Object.assign({}, this.selectedJob, { timestr: +new Date() })
      this.data.push(temp)
    },

    moveUp() {
      console.log('up')
      if (this.selectRowIndex > 0) {
        this.swapArray(this.selectRowIndex - 1, this.selectRowIndex)
      }
    },
    moveDown() {
      console.log('down')
      if (this.selectRowIndex < this.data.length - 1) {
        this.swapArray(this.selectRowIndex, this.selectRowIndex + 1)
      }
    },
    swapArray(index1, index2) {
      this.data[index1] = this.data.splice(index2, 1, this.data[index1])[0]
      this.refresh()
    },
    deleteJpb() {
      this.selectRow = {}
      this.needSetJob = null
      this.data.splice(this.selectRowIndex, 1)
    },
    /**
     * 表格操作
     */
    formatterJobType(row) {
      return this.job_type_map[row.job_type]
    },
    formatterXxx(row) {
      return this.xxx_map[row.xxx]
    },
    getRowKeys(row) {
      return row.timestr
    },
    handleCurrentChange(val) {
      if (val) {
        this.selectRow = val
      }
      this.selectRow = {}
    },
    // 作业配置
    handleJobSet(row) {
      this.needSetJob = row
      this.$refs.jobConfig.showMoel()
    },
    // 任务配置
    handleTaskSet(row) {
      this.needSetJob = row
      this.$refs.taskConfig.showMoel()
    },
    refresh() {
      this.data = this.data.concat([])
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
}
.info {
  border-radius: 4px;
  background-color: #fff;
  .info-title {
    font-size: 18px;
    line-height: 24px;
    padding: 16px 0 16px 31px;
    border-bottom: 1px solid #E8E8E8;
  }
  .info-content {
    padding: 16px 31px;
  }
}
.container-content {
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
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
    padding-left: 13px;
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
