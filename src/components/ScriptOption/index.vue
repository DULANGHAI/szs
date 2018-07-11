<template>
  <div class="script-option">
    <div class="flex-1 marr20">
      <div class="flex">
        <svg-icon icon-class="icon-script" :style="{ width: '24px', height: '24px', marginRight: '10px' }"/>
        <div>
          <div class="name">{{data.name}}</div>
          <div class="path">{{data.full_path}}</div>
        </div>
      </div>
      <div class="comment">{{'介绍：' + data.comment}}</div>
    </div>
    <risk-level :level="data.risk_level"></risk-level>
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'

export default {
  props: {
    data: {
      type: Object
    }
  },
  components: {
    RiskLevel
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.script-option {
  min-width: 466px;
  height: 65px;
  padding: 8px 13px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.flex-1 {
  flex: 1;
}
.marr20 {
  margin-right: 20px;
}
.flex {
  display: flex;
}
.name {
  color: #000000;
}
.path {
  font-size: 10px;
  line-height: 14px;
  color: #727373;
}
.comment {
  margin-top: 5px;
  font-size: 10px;
  line-height: 14px;
  color: #727373;
}
</style>
