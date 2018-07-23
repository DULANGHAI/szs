<template>
  <div>
    <el-form ref="form" label-width="84px" size="small" label-position="left">
      <el-form-item label="任务类型">
        <div>{{data.type}}</div>
      </el-form-item>

      <div style="display: flex;">
        <el-form-item label="目标系统">
          <div>{{data.target_system}}</div>
        </el-form-item>
        <el-form-item label="语言" label-width="50px" style="margin-left: 40px;">
          <div>{{data.language}}</div>
        </el-form-item>
      </div>

      <el-form-item label="命令" v-if="data.type === 'command'">
        <div>{{data.command}}</div>
      </el-form-item>

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
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'

export default {
  props: {
    data: Object
  },
  components: {
    RiskLevel
  }
}
</script>

<style lang="scss" scoped>

</style>
