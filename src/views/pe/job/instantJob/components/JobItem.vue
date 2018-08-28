<template>
  <div class="script-option" :class="{'selected': selected.id && (data.id === selected.id)}" @click="handleSelect">
    <div class="flex">
      <div class="flex-1 marr10">
        <div class="flex">
          <svg-icon icon-class="icon-script" :style="{ width: '24px', height: '24px', marginRight: '10px' }"/>
          <div>
            <div class="name">{{data.name}}</div>
            <div class="path">
              <div>创建人：{{data.creator}}</div>
              <div style="margin-left: 20px;">类型：{{job_type_map[data.job_type]}}</div>
            </div>
          </div>
        </div>
      </div>
      <risk-level :level="data.risk_level"></risk-level> 
    </div>
    <div class="comment">{{'介绍：' + data.description}}</div>
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'

export default {
  props: {
    uniqueId: Number,
    data: {
      type: Object
    },
    selected: {
      type: Object,
      default: {}
    },
    selectNode: Function
  },
  components: {
    RiskLevel
  },
  data() {
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查'
    }
    return {}
  },
  methods: {
    handleSelect() {
      if (this.data.id !== this.selected.id) {
        this.selectNode && this.selectNode(this.data)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.script-option {
  // min-width: 466px;
  min-height: 65px;
  padding: 8px 13px;
  // display: flex;
  // justify-content: space-between;
  // align-items: flex-start;
  &:hover {
    background-color: #F0FAFF;
  }
}
.selected {
  border: 1px solid #1890FF;
}
.flex-1 {
  flex: 1;
}
.marr10 {
  margin-right: 10px;
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
  display: flex;
}
.comment {
  margin-top: 5px;
  font-size: 10px;
  line-height: 14px;
  color: #727373;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
