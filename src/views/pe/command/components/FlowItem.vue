<template>
  <div class="script-option" :class="{'selected': selected.id && (data.id === selected.id)}" @click="handleSelect">
    <!-- <div class="flex">
      <div class="flex-1 marr10">
        <div class="flex">
          <svg-icon icon-class="icon-script" :style="{ width: '24px', height: '24px', marginRight: '10px' }"/>
          <div>
            <div class="name">{{data.name}}</div>
            <div class="path">
              <div>创建人：{{data.creator}}</div>
              <div style="margin-left: 20px;">类型：</div>
            </div>
          </div>
        </div>
      </div>
      <risk-level :level="data.risk_level"></risk-level> 
    </div>
    <div class="comment">{{'介绍：' + data.description}}</div> -->
    <!-- 时间和耗时 -->
    <div class="flex time">
      <div class="flex-1">{{$dayjs(data.updated_at).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div>{{data.time + ' second'}}</div>
    </div>
    <!-- IP -->
    <div class="ellipsis">{{getIp()}}</div>
    <!-- 命令 -->
    <div class="ellipsis">{{getCommand()}}</div>
  </div>
</template>

<script>
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
  data() {
    return {}
  },
  methods: {
    getIp() {
      return 'IP:' + JSON.parse(this.data.target_ip).host.toString()
    },
    getCommand() {
      return '命令:' + this.data.command
    },
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
  height: 65px;
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
.time {
  color: #000000;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
