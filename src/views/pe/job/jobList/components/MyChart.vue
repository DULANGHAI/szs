<template>
  <div>
    <div class="flex-center flex-v relative">
      <div v-if="bro !== undefined && bro !== 0">
        <!-- 竖线 -->
        <div class="v-line"></div>
        <!-- 条件按钮 -->
        <div class="cmd" :class="{'active': data.condition}" @click="handleConditionClick">cmd</div>
      </div>
      
      <!-- 当前节点 -->
      <div>
        <command-option v-if="data.type === 'command'" :data.sync="data" :uniqueId="uniqueId"
          :selected="selected"
          :selectNode="selectNode"></command-option>
        <end-option v-else-if="data.type.indexOf('end_') === 0"
          :data.sync="data"
          :uniqueId="uniqueId"
          :selected="selected"
          :selectNode="selectNode"></end-option>
      </div>
      <!-- 横线 -->
      <div v-if="bro !== 0 || index !== 0" :class="getClass()"></div>
      <!-- 子节点 -->
      <div v-if="data.next && data.next.length" style="margin-top: 80px;">
        <div class="flex-between flex-h">
          <my-chart v-for="(item, index) in data.next"
            :key="index"
            :uniqueId="uniqueId"
            :data.sync="item"
            :selected="selected"
            :bro="data.next.length"
            :index="index"
            :selectNode="selectNode"
            :selectCondition="selectCondition"></my-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommandOption from './CommandOption'
import EndOption from './EndOption'

export default {
  name: 'my-chart',
  components: {
    CommandOption,
    EndOption
  },
  props: {
    uniqueId: Number,
    data: {
      type: Object,
      default: {}
    },
    selected: Object,
    bro: {
      type: Number,
      default: 0
    },
    index: Number,
    selectNode: Function,
    selectCondition: Function
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
    },
    handleConditionClick() {
      this.selectCondition(this.data)
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
  top: -50px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #DFE1E6;
}
.h-line-left {
  position: absolute;
  top: -50px;
  right: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
}
.h-line-right {
  position: absolute;
  top: -50px;
  left: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
}
.v-line {
  position: absolute;
  top: -50px;
  left: 50%;
  width: 1px;
  height: 50px;
  background-color: #DFE1E6;
}
.cmd {
  position: absolute;
  top: -36px;
  left: calc(50% - 21px);
  width: 42px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #DFE1E6;
  border-radius: 4px;
  z-index: 1;
  cursor: pointer;
}
.active {
  background: #E6F7FF;
  border: 1px solid #91D5FF;
}
.relative {
  position: relative;
}
</style>
