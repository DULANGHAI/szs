<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>

    <div class="container-body">
      <!-- 作业信息 -->
      <div class="block-item">
        <div class="block-title ">作业信息</div>
        <div class="block-content">
          <div class="flex">
            <div class="flex-1 marr-20">
              <el-form ref="form" label-width="100px" size="small" label-position="left">
                <el-form-item label="作业名">
                  <el-input v-if="!view" v-model="form.job_name" placeholder="请输入"></el-input>
                  <div v-if="view">{{form.job_name}}</div>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-if="!view" type="textarea" v-model="form.job_description" rows="4" placeholder="请输入"></el-input>
                  <div v-if="view">{{form.job_description}}</div>
                </el-form-item>
                <el-form-item label="账号">
                  <el-select v-if="!view" v-model="form.account" placeholder="请选择">
                    <el-option v-for="item in account_arr" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div v-if="view">{{form.account}}</div>
                </el-form-item>
                <el-form-item label="目标IP">
                  <el-select v-if="!view" v-model="form.job_target_ip" placeholder="请选择">
                    <el-option v-for="item in ip_arr" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div v-if="view">{{form.job_target_ip}}</div>
                </el-form-item>
                <el-form-item label="失败重试次数">
                  <el-input-number v-if="!view" v-model="form.job_frequency" controls-position="right" :min="1" :precision="1"></el-input-number>
                  <span v-if="view">{{form.job_frequency}}</span>
                  次
                </el-form-item>
              </el-form>
            </div>
            <div class="flex-1 marr-20">
              <el-form ref="form" label-width="84px" size="small" label-position="left">
                <el-form-item label="系统类型">
                  <el-select v-if="!view" v-model="form.job_system_type" @change="systemChange" placeholder="请选择" :disabled="!Object.keys(systemAndLang).length">
                    <el-option v-for="item in Object.keys(systemAndLang)" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <div v-if="view">{{form.job_system_type}}</div>
                </el-form-item>
                <el-form-item label="作业类型">
                  <el-radio-group v-if="!view" v-model="form.job_type">
                    <el-radio label="command">普通作业</el-radio>
                    <el-radio label="script">应用更新&发布</el-radio>
                    <el-radio label="file">应用下载</el-radio>
                    <el-radio label="file1">日常检查</el-radio>
                  </el-radio-group>
                  <div v-if="view">{{form.job_type}}</div>
                </el-form-item>
                <el-form-item label="启用">
                  <el-switch v-if="!view" v-model="form.job_status"></el-switch>
                  <div v-if="view">{{form.job_status}}</div>
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
          <div class="op-item" :class="{disable: conditionDisable}">
            <svg-icon icon-class="condition_job" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">条件编辑</div>
          </div>
          <div class="op-item" @click="enlarge">
            <svg-icon icon-class="enlarge" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">放大</div>
          </div>
          <div class="op-item" @click="narrow">
            <svg-icon icon-class="narrow" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">缩小</div>
          </div>
          <div class="op-item" :class="{disable: removeDisable}">
            <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
            <div class="mart-10">删除</div>
          </div>
        </div>
        <!-- 流程图 -->
        <div class="chart-content">
          <!-- 多套一层用来缩放 -->
          <div v-if="scheduling.id" :style="{transform: 'scale('+ scale / 10 +')'}">
            <my-chart :data.sync="scheduling"
              :selectedId="selected.id"
              :selectNode="selectNode"
              :forceUpdate="forceUpdate"></my-chart>
          </div>
        </div>
      </div>
      <!-- 配置 -->
      <div class="block-item">
        <div class="block-title ">配置</div>
      </div>
    </div>

    <!-- 添加作业的model -->
    <add-job-model :show.sync="showAddModel" :addNode="addNode"></add-job-model>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import ScriptOption from '@/components/ScriptOption'
import MyChart from './components/MyChart'
import AddJobModel from './components/AddJobModel'

import { getLanguageApi } from '@/api/pe/taskManage/taskList'

export default {
  props: ['id', 'view'],
  components: {
    Breadcrumb,
    RiskLevel,
    ScriptOption,
    MyChart,
    AddJobModel
  },
  data() {
    return {
      form: {
        job_name: '',
        job_description: '',
        account: '',
        job_target_ip: '',
        job_frequency: 1,
        job_system_type: '',
        job_type: '',
        job_status: false
      },
      account_arr: [],
      ip_arr: [],
      systemAndLang: {},
      scheduling: {},
      selected: {}, // 选中的节点
      scale: 10,
      showAddModel: false
    }
  },
  computed: {
    addDisable() {
      if (this.selected.id === undefined && this.scheduling.id !== undefined) {
        return true
      } else {
        return false
      }
    },
    conditionDisable() {
      if (this.selected.id === undefined || this.selected.node_level === 0) {
        return true
      } else {
        return false
      }
    },
    removeDisable() {
      if (this.selected.id === undefined) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    if (this.id) {
      Promise.all([getLanguageApi()])
        .then(res => {
          this.systemAndLang = res[0]
        }).catch(err => {
          console.log(err)
        })
    } else {
      // todo
      Promise.all([getLanguageApi()])
        .then(res => {
          this.systemAndLang = res[0]
        })
    }
  },
  methods: {
    systemChange() {},
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
    },
    addNode(item) {
      if (this.scheduling.id === undefined) {
        this.scheduling = item
      } else {
        if (!this.selected.next) {
          this.selected.next = []
        }
        this.selected.next.push(item)
      }
    },
    forceUpdate() {
      this.scheduling = Object.assign({}, this.scheduling)
    },
    openJobModel() {
      this.showAddModel = true
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
