<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      <div>{{$route.name}}</div>
      <!-- 添加作业按钮组 -->
      <div v-if="!view && !id">
        <el-button type="primary" @click="submitAll">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
      <!-- 查看的按钮组 -->
      <div v-if="view">
        <el-button type="primary" @click="goEdit">编辑</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
      <!-- 编辑的按钮组 -->
      <div v-if="!view && id">
        <el-button type="primary" @click="update">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <div class="container-body" v-loading="loading">
      <!-- 作业信息 -->
      <div class="block-item">
        <div class="block-title ">作业信息</div>
        <div class="block-content">
          <div class="flex">
            <div class="flex-1 marr-20">
              <el-form ref="form" label-width="100px" size="small" label-position="left">
                <el-form-item label="作业名">
                  <el-input v-if="!view" v-model="form.name" placeholder="请输入"></el-input>
                  <div v-if="view">{{form.name}}</div>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-if="!view" type="textarea" v-model="form.description" rows="4" placeholder="请输入"></el-input>
                  <div v-if="view">{{form.description}}</div>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-if="!view" v-model="form.execution_account" placeholder="请输入"></el-input>
                  <div v-if="view">{{form.execution_account}}</div>
                </el-form-item>
                <el-form-item label="目标IP">
                  <treeselect v-if="!view" v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
                  <div v-if="view">{{form.target_ip}}</div>
                </el-form-item>
                <el-form-item label="失败重试次数">
                  <el-input-number v-if="!view" v-model="form.frequency" controls-position="right" :min="1" :precision="1"></el-input-number>
                  <span v-if="view">{{form.frequency}}</span>
                  次
                </el-form-item>
              </el-form>
            </div>
            <div class="flex-1 marr-20">
              <el-form ref="form" label-width="84px" size="small" label-position="left">
                <el-form-item label="系统类型">
                  <el-select v-if="!view" v-model="form.system_type" @change="systemChange" placeholder="请选择" :disabled="!Object.keys(systemAndLang).length">
                    <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div v-if="view">{{form.system_type}}</div>
                </el-form-item>
                <el-form-item label="作业类型">
                  <el-radio-group v-if="!view" v-model="form.job_type">
                    <el-radio v-for="(item, index) in Object.keys(job_type_map)" :key="index" :label="item">{{job_type_map[item]}}</el-radio>
                  </el-radio-group>
                  <div v-if="view">{{job_type_map[form.job_type]}}</div>
                </el-form-item>
                <el-form-item v-if="form.job_type === '应用更新&发布' || form.job_type === '应用下线'" label="应用实例">
                  <el-select v-if="!view" v-model="form.applications" placeholder="请选择">
                    <el-option v-for="item in applications_arr" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div v-if="view">{{form.applications}}</div>
                </el-form-item>
                <el-form-item label="启用">
                  <el-switch v-model="form.status" :disabled="view === '1'"></el-switch>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 作业编排 -->
      <div class="block-item">
        <div class="block-title ">作业编排</div>
        <!-- 操作 -->
        <div class="tool-box">
          <div class="op-item" :class="{disable: addDisable}" @click="openJobModel">
            <svg-icon icon-class="add_job" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">添加作业</div>
          </div>
          <div class="op-item" :class="{disable: endDisable}" @click="openEndModel">
            <svg-icon icon-class="end_job" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">结束节点</div>
          </div>
          <div class="op-item" @click="enlarge">
            <svg-icon icon-class="enlarge" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">放大</div>
          </div>
          <div class="op-item" @click="narrow">
            <svg-icon icon-class="narrow" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">缩小</div>
          </div>
          <div class="op-item" :class="{disable: removeDisable}" @click="removeNode">
            <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">删除</div>
          </div>
        </div>
        <!-- 流程图 -->
        <div class="chart-content">
          <!-- 多套一层用来缩放 -->
          <div v-if="scheduling.id" :style="{transform: 'scale('+ scale / 10 +')'}">
            <my-chart :uniqueId="uniqueId"
              :data.sync="scheduling"
              :selected="selected"
              :selectNode="selectNode"
              :selectCondition="selectCondition"></my-chart>
          </div>
        </div>
      </div>
      <!-- 配置 -->
      <div v-if="selected.id" class="block-item">
        <div class="block-title">{{selected.name}}的配置</div>
        <div class="block-content">
          <!-- 命令类型 -->
          <command-show v-if="selected.type === 'command'" :data="selected"></command-show>
          <!-- 脚本类型 -->
          <script-show v-if="selected.type === 'script'" :view="view" :data.sync="selected" :key="uniqueId"></script-show>
          <!-- 文件分发类型 -->
          <file-show v-if="selected.type === 'file'" :view="view" :data.sync="selected" :key="uniqueId"></file-show>
        </div>
      </div>
    </div>

    <!-- 添加作业的model -->
    <add-job-model :show.sync="showAddModel" :addNode="addNode" :systemType="form.system_type"></add-job-model>
    <!-- 添加结束节点的model -->
    <add-end-model :show.sync="showEndModel" :addNode="addNode"></add-end-model>
    <!-- 条件编辑 -->
    <condition-model v-if="showConditionModel"
      :view="view"
      :uniqueId="uniqueId"
      :data="conditionNode"
      :show.sync="showConditionModel"
      :addCondition="addCondition"></condition-model>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import ScriptOption from '@/components/ScriptOption'
import MyChart from './components/MyChart'
import AddJobModel from './components/AddJobModel'
import AddEndModel from './components/AddEndModel'
import ConditionModel from './components/ConditionModel'
import CommandShow from './components/CommandShow'
import ScriptShow from './components/ScriptShow'
import FileShow from './components/FileShow'

import { getLanguageApi, createJobApi, getJobDataApi, updateJobApi } from '@/api/pe/jobManage/jobList'
import { getIpApi } from '@/api/pe/common/index'

export default {
  props: ['id', 'view'],
  components: {
    Treeselect,
    Breadcrumb,
    RiskLevel,
    ScriptOption,
    MyChart,
    AddJobModel,
    AddEndModel,
    ConditionModel,
    CommandShow,
    ScriptShow,
    FileShow
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {
      options: [],
      loading: false,
      form: {
        name: '',
        description: '',
        execution_account: '',
        target_ip: null,
        frequency: 1,
        system_type: '',
        job_type: 'ordinary',
        applications: '',
        status: false
      },
      ip_arr: [],
      applications_arr: [],
      systemAndLang: {},

      scheduling: {},
      selected: {}, // 选中的节点
      conditionNode: {}, // 选中的条件节点
      uniqueId: +new Date(),
      scale: 10,
      showAddModel: false,
      showEndModel: false,
      showConditionModel: false
    }
  },
  computed: {
    addDisable() {
      if (this.selected.id === undefined && this.scheduling.id !== undefined ||
        this.form.system_type === '' ||
        this.view) {
        return true
      } else {
        return false
      }
    },
    endDisable() {
      if (this.uniqueId) {
        if (this.selected.id === undefined ||
        (this.selected.next && this.selected.next.length !== 0) ||
        (this.selected.type.indexOf('end_') === 0) ||
        this.view) {
          return true
        } else {
          return false
        }
      }
    },
    removeDisable() {
      if (this.selected.type === undefined || this.view) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.loading = true
    if (this.id) {
      Promise.all([getLanguageApi(), getJobDataApi(this.id), getIpApi()])
        .then(res => {
          this.systemAndLang = res[0]
          this.form = res[1]
          this.form.target_ip = JSON.parse(res[1].target_ip).host
          this.scheduling = JSON.parse(res[1].scheduling)
          this.options = res[2]
        }).finally(() => {
          this.loading = false
        })
    } else {
      // todo
      Promise.all([getLanguageApi(), getIpApi()])
        .then(res => {
          this.systemAndLang = res[0]
          this.options = res[1]
        }).finally(() => {
          this.loading = false
        })
    }
  },
  methods: {
    systemChange() {
      this.scheduling = {}
      this.selected = {} // 选中的节点
      this.conditionNode = {} // 选中的条件节点
      this.uniqueId = +new Date()
      this.scale = 10
    },
    enlarge() {
      if (this.scale < 10) {
        this.scale++
      }
    },
    narrow() {
      if (this.scale > 1) {
        this.scale--
      }
    },
    selectNode(obj) {
      this.selected = obj
      this.uniqueId = +new Date()
    },
    selectCondition(obj) {
      if (!obj.condition) {
        obj.condition = {
          type: '',
          value: '',
          parent: obj.parentstr
        }
      }
      this.conditionNode = obj
      this.showConditionModel = true
    },
    addCondition(data) {
      if (!data.type) {
        delete this.conditionNode.condition
      } else {
        this.conditionNode.condition = data
      }
      this.doCondition(this.scheduling, this.conditionNode)
      this.conditionNode = {}
      this.uniqueId = +new Date()
    },
    doCondition(scheduling, conditionNode) {
      for (let i = 0; i < scheduling.next.length; i++) {
        if (scheduling.next[i].id === conditionNode.id && scheduling.next[i].timestr === conditionNode.timestr) {
          scheduling.next[i] = conditionNode
          break
        } else if (scheduling.next[i].next) {
          scheduling.next[i] = this.doCondition(scheduling.next[i], conditionNode)
        }
      }
      return scheduling
    },
    addNode(item) {
      item.timestr = +new Date()
      item.parentstr = this.selected.timestr
      if (this.scheduling.id === undefined) {
        item.node_level = 0
        this.scheduling = item
      } else {
        if (!this.selected.next) {
          this.selected.next = []
        }
        this.selected.next.push(item)
        this.changeScheduling()
      }
    },
    // 数据只是添加到了selected里，要添加scheduling里
    changeScheduling() {
      const temp = this.doRecursion(this.scheduling, this.selected)
      this.scheduling = temp
      this.uniqueId = +new Date()
    },
    doRecursion(scheduling, selected) {
      if (scheduling.id === selected.id && scheduling.timestr === selected.timestr) {
        scheduling = selected
      } else if (scheduling.next) {
        for (let i = 0; i < scheduling.next.length; i++) {
          scheduling.next[i] = this.doRecursion(scheduling.next[i], selected)
        }
      } else {
        scheduling.next = []
      }
      return scheduling
    },
    removeNode() {
      if (this.scheduling.id === this.selected.id && this.scheduling.timestr === this.selected.timestr) {
        this.scheduling = {}
      } else if (this.scheduling.id === undefined && this.selected.id === undefined && this.scheduling.timestr === this.selected.timestr) {
        this.scheduling = {}
      } else {
        // 递归查找减掉数据
        const temp = this.doRemove(this.scheduling, this.selected)
        this.scheduling = temp
      }
      this.selected = {}
      this.uniqueId = +new Date()
    },
    doRemove(scheduling, selected) {
      if (scheduling.next) {
        for (let i = 0; i < scheduling.next.length; i++) {
          if (scheduling.next[i].id === selected.id && scheduling.next[i].timestr === selected.timestr) {
            scheduling.next.splice(i, 1)
            break
          } else if (scheduling.next[i].next) {
            scheduling.next[i] = this.doRemove(scheduling.next[i], selected)
          }
        }
      }

      return scheduling
    },
    openJobModel() {
      this.showAddModel = true
    },
    openEndModel() {
      this.showEndModel = true
    },
    /**
     * 提交操作
     */
    submitAll() {
      const job_task_id_list = []
      this.getTaskIdList(this.scheduling, job_task_id_list)
      const data = {
        name: this.form.name,
        description: this.form.description,
        execution_account: this.form.execution_account,
        target_ip: this.form.target_ip,
        frequency: this.form.frequency,
        system_type: this.form.system_type,
        job_type: this.form.job_type,
        applications: this.form.applications,
        status: this.form.status,
        scheduling: JSON.stringify(this.scheduling),
        job_task_id_list: job_task_id_list
      }
      createJobApi(data).then(res => {
        this.$router.push({
          path: '/pe/jobManage/jobList'
        })
      })
    },
    getTaskIdList(data, res) {
      if (data.id && res.indexOf(data.id) === -1) {
        res.push(data.id)
        if (data.next && data.next.length) {
          for (let i = 0; i < data.next.length; i++) {
            this.getTaskIdList(data.next[i], res)
          }
        }
      }
    },
    goBack() {
      this.$router.back()
    },
    goEdit() {
      this.$router.push({
        path: `/pe/jobManage/jobEdit/${this.id}`
      })
    },
    update() {
      const job_task_id_list = []
      this.getTaskIdList(this.scheduling, job_task_id_list)
      const data = {
        id: this.form.id,
        name: this.form.name,
        description: this.form.description,
        execution_account: this.form.execution_account,
        target_ip: this.form.target_ip,
        frequency: this.form.frequency,
        system_type: this.form.system_type,
        job_type: this.form.job_type,
        applications: this.form.applications,
        status: this.form.status,
        scheduling: JSON.stringify(this.scheduling),
        job_task_id_list: job_task_id_list,
        creator: this.form.creator,
        success_rate: this.form.success_rate
      }
      updateJobApi(data).then(res => {
        this.$router.push({
          path: '/pe/jobManage/jobList'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
  & /deep/ .el-select {
    width: 100%;
  }
}
.container-title {
  display: flex;
  justify-content: space-between;
  padding: 20px 22px 30px;
}
.block-item {
  border-radius: 4px;
  background: #ffffff;
  &:not(:first-child) {
    margin-top: 24px;
  }
}
.block-title {
  padding: 16px 32px;
  font-size: 18px;
  color: rgba(0,0,0,0.85);
  line-height: 28px;
  font-weight: 700;
  border-bottom: 1px solid #E8E8E8;
}
.block-content {
  padding: 24px 32px;
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.tool-box {
  height: 70px;
  background: #F8F8F8;
  display: flex;
  align-items: center;
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
.mart-10 {
  margin-top: 10px;
}
.marr-20 {
  margin-right: 20px;
}
.chart-content {
  overflow: auto;
  height: 500px;
}
</style>
