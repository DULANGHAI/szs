<template>
  <div>
    <el-form ref="form" label-width="84px" size="small" label-position="left">
      <el-form-item label="任务类型">
        <div>{{taskTypeMap[data.type]}}</div>
      </el-form-item>

      <div style="display: flex;">
        <el-form-item label="目标系统">
          <div>{{data.target_system}}</div>
        </el-form-item>
        <el-form-item v-if="data.type !== 'playbook'" label="语言" label-width="50px" style="margin-left: 40px;">
          <div>{{data.language}}</div>
        </el-form-item>
      </div>

      <div v-if="data.type === 'script'">
        <el-form-item label="脚本">
          <div>{{selectedScript.name}}</div>
        </el-form-item>
        <el-form-item label="脚本版本">
          <div>{{selectedVersion.version}}</div>
          <el-button type="text" size="small" @click="handleViewScript">查看脚本</el-button>
        </el-form-item>
        <el-form-item label="脚本变量">
          <el-input v-if="data.language !== 'playbook'" v-model="data.script_parameter"></el-input>
        </el-form-item>
        
      </div>

      <div v-if="data.type === 'playbook'">
        <el-form-item label="playbook">
          <div>{{selectedPlaybook.name}}</div>
        </el-form-item>
        <el-form-item label="变量"></el-form-item>
        <script-parame ref="scriptParame"></script-parame>
      </div>

      <div>
        <el-form-item label="超时时间">
          <span>{{data.time_out}}</span>
          秒
        </el-form-item>
        <el-form-item label="风险">
          <risk-level :level="data.risk_level"></risk-level>
        </el-form-item>
        <el-form-item label="风险说明">
          <div>{{data.risk_statement}}</div>
        </el-form-item>
      </div>

      <el-form-item label="启用">
        <el-switch v-model="data.is_enable" disabled></el-switch>
      </el-form-item>
    </el-form>

    <!-- script playbook -->
    <div v-if="data.type === 'playbook'">
      <el-button size="small" type="primary" class="margl-20" @click="playbookOk">确定</el-button>
      <el-button size="small" @click="playbookCancle">取消</el-button>
    </div>

    <!-- 查看脚本 -->
    <view-script ref="viewScript"></view-script>
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'
import ScriptParame from '@/views/pe/task/taskList/components/ScriptParame'
import ViewScript from '@/views/pe/task/taskList/components/ViewScript'
import { getLanguageApi, getAllScriptApi, getScriptVersionApi } from '@/api/pe/taskManage/taskList'

export default {
  name: 'ScriptShow',
  props: {
    view: String,
    data: Object
  },
  components: {
    RiskLevel,
    ScriptParame,
    ViewScript
  },
  data() {
    return {
      taskTypeMap: {
        command: '命令',
        script: '脚本',
        file: '文件分发',
        playbook: 'playbook'
      },
      systemAndLang: {},
      scriptOptions: [],
      scriptVersionOptions: [],
      selectedScript: {}, // 选中的脚本
      selectedVersion: {},
      // 临时存选择的playbook信息
      selectedPlaybook: {}
    }
  },
  mounted() {
    if (this.data.type === 'script') {
      getLanguageApi().then(res => {
        this.systemAndLang = res
      }).then(() => {
      // 1.先获取脚本选项
        const id = this.getLanguageId(this.data.language)
        getAllScriptApi({ id: id }).then(res => {
          this.scriptOptions = res
          // 2.确定选中的脚本是哪个
          this.selectedScript = this.computeSelectedScript(res)
          // 3.获取脚本版本选项
          getScriptVersionApi(this.selectedScript.file_id).then(res1 => {
            this.scriptVersionOptions = res1
            // 4.确定选中的版本是哪个
            this.selectedVersion = this.computeSelectedVersion(res1)
          })
        })
      })
    } else {
      // 如果选择的是playbook
      this.selectedPlaybook = JSON.parse(this.data.script)

      const data = JSON.parse(this.data.script_parameter)
      const temp = []
      Object.keys(data).forEach(keyName => {
        temp.push({
          key: keyName,
          value: data[keyName]
        })
      })
      this.$refs.scriptParame.setData(temp)
    }
  },
  methods: {
    getLanguageId(val) {
      let result = ''
      const data = this.systemAndLang[this.data.target_system]
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === val) {
          result = data[i].id
          break
        }
      }
      return result
    },
    computeSelectedScript(res) {
      let result = {}
      for (let i = 0; i < res.length; i++) {
        if (res[i].full_path === this.data.script) {
          result = res[i]
          break
        }
      }
      return result
    },
    computeSelectedVersion(res) {
      let result = {}
      for (let i = 0; i < res.length; i++) {
        if (res[i].commit_sha === this.data.script_version) {
          result = res[i]
          break
        }
      }
      return result
    },
    handleViewScript() {
      console.log('点击查看')
      if (!this.data.project_id) {
        this.$message.info('请选择语言')
        return
      }
      if (!this.selectedScript.full_path) {
        this.$message.info('请选择脚本')
        return
      }
      if (!this.selectedVersion.commit_sha) {
        this.$message.info('请选择脚本版本')
        return
      }
      this.$refs.viewScript.setParames({
        id: this.data.project_id,
        full_path: this.selectedScript.full_path,
        branch: this.selectedVersion.commit_sha
      })
      this.$refs.viewScript.showModel()
    },
    playbookCancle() {
      const data = JSON.parse(this.data.script_parameter)
      const temp = []
      Object.keys(data).forEach(keyName => {
        temp.push({
          key: keyName,
          value: data[keyName]
        })
      })
      this.$refs.scriptParame.setData(temp)
      this.$message.success('操作成功')
    },
    playbookOk() {
      this.data.script_parameter = JSON.stringify(this.$refs.scriptParame.getData())
      this.$message.success('操作成功')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
