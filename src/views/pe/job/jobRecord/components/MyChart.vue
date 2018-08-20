<template>
  <div>
    <div class="flex-center flex-v relative">
      <div v-if="bro !== undefined && bro !== 0">
        <!-- 竖线 -->
        <div class="v-line" :class="getClass2"></div>
        <!-- 条件按钮 -->
        <div class="cmd" :class="{'active': data.condition}">cmd</div>
      </div>
      
      <!-- 当前节点 -->
      <div>
        <command-option v-if="data.type === 'command' || data.type === 'script' || data.type === 'file'" :data.sync="data" :uniqueId="uniqueId"></command-option>
        <end-option v-else-if="data.type.indexOf('end_') === 0"
          :data.sync="data"
          :uniqueId="uniqueId"></end-option>
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
            :bro="data.next.length"
            :index="index"
            :successBro="getSuccessBro"></my-chart>
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
    bro: {
      type: Number,
      default: 0
    },
    index: Number,
    successBro: Array
  },
  computed: {
    getClass2() {
      if (this.data.task_reult === 'runner_on_ok') {
        return 'execution-status-success'
      } else if (this.data.task_reult === 'runner_on_skipped') {
        return ''
      } else {
        return 'execution-status-failed'
      }
    },
    getSuccessBro() {
      if (this.data.next && this.data.next.length > 1) {
        return this.data.next.map((item, index) => {
          if (item.task_reult === 'success') {
            return 1
          }
          return 0
        })
      }
      return []
    }
  },
  methods: {
    getClass() {
      let str = ''
      if (this.bro > 1) {
        if (this.index === 0) {
          str = 'h-line-left'
        } else if (this.index === this.bro - 1) {
          str = 'h-line-right'
        } else {
          str = 'h-line'
        }
        if (this.data.task_reult === 'runner_on_ok') {
          str += ' execution-status-success'
        }
        str += this.judge(this.index)
      } else {
        str = ''
      }
      return str
    },
    judge(index) {
      let result = ''
      const middle = this.getMiddle(index)
      if (index < middle) {
        for (let i = 0; i < index; i++) {
          if (this.successBro[i] === 1) {
            result = ' execution-status-success'
            break
          }
        }
      } else if (index > middle) {
        for (let i = index; i < this.successBro.length; i++) {
          if (this.successBro[i] === 1) {
            result = ' execution-status-success'
            break
          }
        }
      } else {
        if (this.successBro[index] === 1) {
          result = ' execution-status-success'
        }
      }
      return result
    },
    getMiddle(index) {
      const length = this.successBro.length
      if (length % 2 === 0) { // 偶数个子节点，那就没有一个子节点正好在父节点正下方
        if (index <= length / 2 - 1) {
          return length / 2
        }
        return length / 2 - 1
      } else {
        return ((length + 1) / 2) - 1
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
  top: -50px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #DFE1E6;
  &.execution-status-success {
    background-color: #67c23a;
  }
  &.execution-status-failed {
    background-color: #f56c6c;
  }
}
.h-line-left {
  position: absolute;
  top: -50px;
  right: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
  &.execution-status-success {
    background-color: #67c23a;
  }
  &.execution-status-failed {
    background-color: #f56c6c;
  }
}
.h-line-right {
  position: absolute;
  top: -50px;
  left: 0;
  width: 50%;
  height: 1px;
  background-color: #DFE1E6;
  &.execution-status-success {
    background-color: #67c23a;
  }
  &.execution-status-failed {
    background-color: #f56c6c;
  }
}
.v-line {
  position: absolute;
  top: -50px;
  left: 50%;
  width: 1px;
  height: 50px;
  background-color: #DFE1E6;
  &.execution-status-success {
    background-color: #67c23a;
  }
  &.execution-status-failed {
    background-color: #f56c6c;
  }
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
