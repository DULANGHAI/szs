<template>
  <div class="script-option" :class="{'selected': data.id === selectedId}" @click="handleSelect">
    <div class="flex">
      <svg-icon icon-class="icon-script" :style="{ width: '24px', height: '24px', marginRight: '10px' }"/>
      <div>
        <div class="name">{{data.name}}</div>
        <risk-level :level="data.risk_level"></risk-level>
      </div>
    </div>
    <div class="flex-between">
      <div>创建人：{{data.creator}}</div>
      <div>语言：{{data.language}}</div>
    </div>
    <div v-if="data.next && data.next.length" class="after-line"></div>
  </div>
</template>

<script>
import RiskLevel from '@/components/RiskLevel'

export default {
  props: {
    data: {
      type: Object
    },
    selectedId: Number,
    forceUpdate: Function,
    selectNode: Function
  },
  components: {
    RiskLevel
  },
  methods: {
    handleSelect() {
      // const res = this.data
      // res.risk_level = 1
      // this.$emit('update:data', res)
      if (this.data.id === this.selectedId) {
        this.selectNode({})
      } else {
        this.selectNode(this.data)
      }
      this.forceUpdate()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.script-option {
  width: 300px;
  height: 65px;
  padding: 8px 13px;
  border: 1px solid #DFE1E6;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}
.selected {
  border-color: #1890FF;
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
.flex-between {
  display: flex;
  justify-content: space-between;
}
.after-line {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 1px;
  color: #d6e2ea;
  background-color: #DFE1E6;
  height: 30px;
}
</style>
