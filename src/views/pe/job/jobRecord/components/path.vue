<template>
  <div>
    <!-- 基础信息 -->
    <div class="basic-info">
      <el-form ref="form" label-width="80px" size="small" label-position="left">
        <el-row>
          <el-col :span="5">
            <el-form-item label="作业名">
              <div>{{form.name}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="作业类型">
              <div>{{job_type_map[form.job_type]}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="IP">
              <div>{{form.target_ip}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开始时间">
              <div>{{form.start_time ? $dayjs(form.start_time).format('YYYY-MM-DD HH:mm:ss') : ''}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="结束时间">
              <div>{{form.end_time ? $dayjs(form.end_time).format('YYYY-MM-DD HH:mm:ss') : ""}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="执行耗时">
              <div>{{form.time}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <div>{{form.status}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="结果">
              <div>{{form.result}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 路径图 -->
    <div>
       <!-- 作业编排 -->
        <div class="block-item" v-show="scheduling">
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
                :data.sync="scheduling"></my-chart>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import MyChart from './MyChart'

export default {
  components: {
    MyChart
  },
  data() {
    this.execution_type_map = {
      instant: '即时作业',
      timed: '定时作业'
    }
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查',
      distribution: '文件分发'
    }
    return {
      form: {
        name: '',
        job_type: 'ordinary',
        target_ip: '',
        start_time: '',
        end_time: '',
        time: '',
        status: '',
        result: ''
      },
      scheduling: {},
      uniqueId: +new Date(),
      scale: 10
    }
  },
  methods: {
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
    setData(data) {
      this.form = {
        name: data.name,
        job_type: data.job_type,
        target_ip: data.target_ip,
        start_time: data.start_time,
        end_time: data.end_time,
        time: data.time,
        status: data.status,
        result: data.result
      }
      if (data.job_type === 'distribution') {
        this.scheduling = ''
      } else {
        this.scheduling = JSON.parse(data.scheduling)
      }
      this.uniqueId = +new Date()
      this.scale = 10
    }
  }
}
</script>

<style lang="scss" scoped>
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
  padding-top: 20px;
  overflow: auto;
}
</style>
