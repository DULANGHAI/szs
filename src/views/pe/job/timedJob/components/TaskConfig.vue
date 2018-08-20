<template>
  <div class="task-config-container">

    <el-dialog title="任务配置" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
      <el-form :label-position="'left'" label-width="90px" size="small">
        
        <!-- 作业编排 -->
        <div class="block-item">
          <div class="block-title ">请选中任务节点进行配置</div>
          <!-- 操作 -->
          <div class="tool-box">
            <div class="op-item" @click="enlarge">
              <svg-icon icon-class="enlarge" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">放大</div>
            </div>
            <div class="op-item" @click="narrow">
              <svg-icon icon-class="narrow" :style="{ transform: 'scale(1.5)' }" />
              <div class="mart-10">缩小</div>
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
            <script-show v-if="selected.type === 'script'" :data.sync="selected" :key="uniqueId"></script-show>
            <!-- 文件分发类型 -->
          <file-show v-if="selected.type === 'file'" :view="view" :data.sync="selected" :key="uniqueId"></file-show>
          </div>
        </div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import MyChart from '@/views/pe/job/jobList/components/MyChart'
import CommandShow from '@/views/pe/job/jobList/components/CommandShow'
import ScriptShow from '@/views/pe/job/jobList/components/ScriptShow'
import FileShow from '@/views/pe/job/jobList/components/FileShow'

import { updateJobApi } from '@/api/pe/jobManage/timedJob'

export default {
  props: {
    data: Object,
    refresh: Function
  },
  components: {
    MyChart,
    CommandShow,
    ScriptShow,
    FileShow
  },
  data() {
    return {
      show: false,
      scheduling: {},
      selected: {}, // 选中的节点
      conditionNode: {}, // 选中的条件节点
      uniqueId: +new Date(),
      scale: 10
    }
  },
  methods: {
    showMoel() {
      this.show = true
    },
    hideModel() {
      this.show = false
    },
    handleOpen() {
      this.scheduling = JSON.parse(this.data.scheduling)
      this.uniqueId = +new Date()
      console.log('open callback ')
    },
    handleClose() {
      console.log('close callback ')
    },
    init() {

    },
    /**
     * 图的操作
     */
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
    selectCondition() {

    },
    /**
     * 提交
     */
    submit() {
      const data = {
        'description': this.data.description,
        'execution_account': this.data.execution_account,
        'timed_expression': this.data.timed_expression,
        'scheduling': JSON.stringify(this.scheduling),
        'frequency': this.data.frequency,
        'target_ip': this.data.target_ip,
        'timed_type': this.data.timed_type

      }
      updateJobApi(this.data.id, data).then(res => {
        this.refresh()
        this.cancel()
      })
    },
    cancel() {
      this.show = false
      this.scheduling = {}
      this.selected = {} // 选中的节点
      this.conditionNode = {} // 选中的条件节点
      this.uniqueId = +new Date()
      this.scale = 10

      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.task-config-container {
  & /deep/ .el-dialog__body {
    line-height: inherit;
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

