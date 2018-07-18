<template>
  <div class="flex-center flex-v relative">
    <!-- 竖线 -->
    <div v-if="bro !== undefined" class="v-line"></div>
    <!-- 当前节点 -->
    <script-option :data.sync="data"
      :forceUpdate="forceUpdate"
      :selectNode="selectNode"></script-option>
    <!-- 横线 -->
    <div v-if="bro !== 0 || index !== 0" :class="getClass()"></div>
    <!-- 子节点 -->
    <div v-if="data.next && data.next.length" style="margin-top: 50px;">
      <div class="flex-between flex-h">
        <my-chart v-for="(item, index) in data.next"
          :key="index"
          :data="item"
          :bro="data.next.length"
          :index="index"
          :forceUpdate="forceUpdate"
          :selectNode="selectNode"></my-chart>
      </div>
    </div>
  </div>
</template>

<script>
import ScriptOption from './ScriptOption'

export default {
  name: 'my-chart',
  components: {
    ScriptOption
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    bro: {
      type: Number,
      default: 0
    },
    index: Number,
    forceUpdate: Function,
    selectNode: Function
  },
  methods: {
    getClass() {
      if (this.bro > 1) {
        if (this.index === 0) {
          return 'h-line-left'
        } else if (this.index === this.bro - 1) {
          return 'h-line-right'
        } else {
          return 'h-line'
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-v {
  flex-direction: column;
}
.flex-h {
  flex-direction: row;
  align-items: flex-start;
}
.flex-1 {
  flex: 1;
}
.h-line {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #DFE1E6;
}
.h-line-left {
  position: absolute;
  top: -20px;
  right: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
}
.h-line-right {
  position: absolute;
  top: -20px;
  left: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
}
.v-line {
  position: absolute;
  top: -20px;
  left: 50%;
  width: 1px;
  height: 20px;
  background-color: #DFE1E6;
}
.relative {
  position: relative;
}
</style>
