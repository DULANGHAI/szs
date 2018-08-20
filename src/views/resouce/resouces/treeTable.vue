<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" label="选择"></el-table-column>
    <el-table-column prop="name" label="名称">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        <svg-icon :icon-class="scope.row.type" />
        {{scope.row.name}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    searchText: String
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    },
    // 判断当前节点是否存在孩子节点
    isHasChildren() {
      let flag = false
      if (this.node.children && this.node.children.length > 0) {
        flag = true
      }
      return flag
    },
    // 如果当前节点名称，有文字和搜索内容匹配，就把匹配的文字标红。
    // 反之，则正常显示节点名称。
    nodeName() {
      if (this.searchText === undefined || this.searchText === '' || this.searchText == null) {
        return this.node.name
      }
      if (this.node.name.indexOf(this.searchText) <= -1) {
        return this.node.name
      }
      return this.replaceAll(this.node.name, this.searchText, '<span style="color:red;">' + this.searchText + '</span>')
    }
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.$emit('update:multipleSelection', val)
    },
    replaceAll(str, substr, replacement) {
      if (!str) {
        return ''
      }
      return str.split(substr).join(replacement)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>